const config = require('../config.json');
import resource from 'resource-router-middleware';
import { calculatePaymentAmount } from '../lib/util'
const stripe = require('stripe')(config.stripe.secretKey);

export default ({ config, db }) => resource({
  // Create payment intent
  id: 'createPaymentIntent',
  create({ body }, res) {
    // const { username, email, card_number, expiration_date, cvv } = body;
    let { currency, items } = body;
    const amount = calculatePaymentAmount(items);
    const initPaymentMethods = config.paymentMethods.filter(paymentMethod => paymentMethod !== 'au_becs_debit');
    const paymentIntent = stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: initPaymentMethods,
    });
    res.json(paymentIntent);
  }
});