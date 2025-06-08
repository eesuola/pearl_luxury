import mongoose from "mongoose";

const { Schema } = mongoose;

const SalesRecordSchema = new Schema({
    receiptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receipt',
        required: true
    },
    recordDate: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true,
        default: [0, 'amount cannot be negative']
    },
    customerName: String,
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentMethod: String
}, {timeStamp: true })


const SalesRecord = mongoose.model("SalesRecord", SalesRecordSchema);
export default SalesRecord;