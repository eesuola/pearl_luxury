import mongoose from 'mongoose';

const salesBookSchema = new mongoose.Schema({
    receiptId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    dateOfPurchase: { type: Date, default: Date.now },

});
const SalesBook = mongoose.model('SalesBook', salesBookSchema);
export default SalesBook;