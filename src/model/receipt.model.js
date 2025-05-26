import mongoose from "mongoose";

const { Schema } = mongoose;

const ReceiptSchema = new Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['bank-transfer', 'cash', 'mobile_money'],
    default: 'bank_transfer'
  },
  notes: String
}, {timestamps: true}
);

ReceiptSchema.pre('save', async function (next) {
    if (!this.receiptNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        const lastReceipt = await this.constructor.findOne({
            receiptNumber: new RegExp(`^RC${year}${month}`)
        }).sort({ receiptNumber: -1});

        let sequence = 1;
        if (lastReceipt) {
            const lastSequence = parseInt(lastReceipt.receiptNumber.slice(-4));
            sequence = lastSequence +1;
        }
        this.receiptNumber = `RC${year}${month}${sequence.toString().padStart(4, '0')}`
    }
    next()
})

const Receipt = mongoose.model("Receipt", ReceiptSchema);
export default Receipt;