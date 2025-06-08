import mongoose from "mongoose";

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  items: [{
    description: String,
    quantity: Number,
    price: Number,
    amount: Number,
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;