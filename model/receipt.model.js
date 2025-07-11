import mongoose from "mongoose";

// Define the receipt schema
const receiptSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhoneNumber: { type: String, required: true },
  description: { type: String, required: true },
  items: [
    {
      itemsPurchased: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Paid", "Unpaid", "Partially Paid"],
  },
  amountPaid: { type: Number, default: 0, required: true },
  balanceToPay: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Cash", "Bank Transfer", "Mobile Payment"],
  },
  dateOfPurchase: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  companyName: { type: String, required: true, default: "Opaline Opaque" },
  companyAddress: {
    type: String,
    required: true,
    default: "12, Jehovah Witness Ashi-Bodija estate Ibadan",
  },
});
const Receipt = mongoose.model("Receipt", receiptSchema);
export default Receipt;
