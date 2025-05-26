import mongoose from "mongoose";

const { Schema } = mongoose;
const InvoiceSchema = new Schema(
  {
    invoiceNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "draft", "paid", "overdue", "cancelled"],
      default: "draft",
    },

    //Terms and Conditions

    terms: {
      type: String,
      default: "Payment validate orders. Rush Orders require 50% deposit.",
    },

    pdfUrl: String,
    emailSent: {
      type: Boolean,
      default: false,
    },


    notes: String,
  },
  { timestamps: true }
);


InvoiceSchema.pre('save', async function (next) {
    if (!this.invoiceNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        const lastInvoice = await this.constructor.findOne({
            invoiceNumber: new RegExp(`^RC${year}${month}`)
        }).sort({ invoiceNumber: -1});

        let sequence = 1;
        if (lastInvoice) {
            const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-4));
            sequence = lastSequence +1;
        }
        this.invoiceNumber = `RC${year}${month}${sequence.toString().padStart(4, '0')}`
    }
    next()
})

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;