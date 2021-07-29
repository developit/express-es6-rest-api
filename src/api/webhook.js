const config = require('../config.json');
import resource from 'resource-router-middleware';
const stripe = require('stripe')(config.stripe.secretKey);

export default ({ config, db }) => resource({
  // Create payment webhook
  id: 'webhook',
  create({ rawBody, headers, body }, res) {
    let data;
    let eventType;
    if (config.stripe.webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          config.stripe.webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = body.data;
      eventType = body.type;
    }
    const object = data.object;

    // Monitor payment_intent.succeeded & payment_intent.payment_failed events.
    if (object.object === 'payment_intent') {
      const paymentIntent = object;
      if (eventType === 'payment_intent.succeeded') {
        console.log(
          `🔔  Webhook received! Payment for PaymentIntent ${paymentIntent.id} succeeded.`
        );
      } else if (eventType === 'payment_intent.payment_failed') {
        const paymentSourceOrMethod = paymentIntent.last_payment_error
          .payment_method
          ? paymentIntent.last_payment_error.payment_method
          : paymentIntent.last_payment_error.source;
        console.log(
          `🔔  Webhook received! Payment on ${paymentSourceOrMethod.object} ${paymentSourceOrMethod.id} of type ${paymentSourceOrMethod.type} for PaymentIntent ${paymentIntent.id} failed.`
        );
        // Note: you can use the existing PaymentIntent to prompt your customer to try again by attaching a newly created source:
        // https://stripe.com/docs/payments/payment-intents/usage#lifecycle
      }
    }
    // Monitor `source.chargeable` events.
    if (
      object.object === 'source' &&
      object.status === 'chargeable' &&
      object.metadata.paymentIntent
    ) {
      const source = object;
      console.log(`🔔  Webhook received! The source ${source.id} is chargeable.`);
      // Find the corresponding PaymentIntent this source is for by looking in its metadata.
      const paymentIntent = stripe.paymentIntents.retrieve(
        source.metadata.paymentIntent
      );
      // Check whether this PaymentIntent requires a source.
      if (paymentIntent.status != 'requires_payment_method') {
        return res.sendStatus(403);
      }
      // Confirm the PaymentIntent with the chargeable source.
      stripe.paymentIntents.confirm(paymentIntent.id, {source: source.id});
    }

    // Monitor `source.failed` and `source.canceled` events.
    if (
      object.object === 'source' &&
      ['failed', 'canceled'].includes(object.status) &&
      object.metadata.paymentIntent
    ) {
      const source = object;
      console.log(`🔔  The source ${source.id} failed or timed out.`);
      // Cancel the PaymentIntent.
      stripe.paymentIntents.cancel(source.metadata.paymentIntent);
    }

    // Return a 200 success code to Stripe.
    res.sendStatus(200);
  }
});