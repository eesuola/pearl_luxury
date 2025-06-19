import mongoose from "mongoose";
const receiptSchema = new mongoose.Schema({
  
    receiptId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhoneNumber: { type: String, required: true },
  items: [
    {
      itemsPurchased: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Cash", "Card", "Online"],
  },
  dateOfPurchase: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});
const Receipt = mongoose.model("Receipt", receiptSchema);
export default Receipt;
