import order from "../models/order";
import resource from "resource-router-middleware";

export default ({ config, db }) =>
  resource({
    /** POST / - Create a new entity */
    create({ body }, res) {
      order.address = body.address;
      order.holdingCode = body.holdingCode;
      order.holdingAmount = body.holdingAmount;
      order.wantCode = body.wantCode;
      order.wantAmount = body.wantAmount;
      order.contact = body.contact;
      order.name = body.name;

      res.json(order);
    }
  });
