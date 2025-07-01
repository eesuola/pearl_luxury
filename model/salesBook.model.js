import mongoose from 'mongoose';

const salesBookSchema = new mongoose.Schema({
    receiptId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true, default: "Opaline Opaque" },
  companyAddress: {
    type: String,
    required: true,
    default: "12, Jehovah Witness Ashi-Bodija estate Ibadan",
  },
    customerName: { type: String, required: true },
    description: { type: String, required: true },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["Paid", "Unpaid", "Partially Paid"],
    },
    amountPaid: { type: Number, required: true },
    balanceToPay: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    dateOfPurchase: { type: Date, default: Date.now },

});
const SalesBook = mongoose.model('SalesBook', salesBookSchema);
export default SalesBook;