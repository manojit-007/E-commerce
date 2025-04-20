import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const orderSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  shippingInfo: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  orderItems: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // Ensure this matches
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
    enum: ["Processing", "Delivered", "Shipped", ]
  },
  paymentInfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paidAt: { type: Date },
  itemsPrice: { type: Number, required: false },
  taxPrice: { type: Number, required: false },
  shippingPrice: { type: Number, required: false },
  totalPrice: { type: Number, required: false },
}, { timestamps: true });

const Order = model("Order", orderSchema);
export default Order;
