
import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    customerName:{
      type: String,
      required: [true, 'Customer Name is required'],
      trim: true
    },
    customerPhone: String,
    customerAddress: String,
    orderDate: {
      type: Date,
      default: Date.now
    },
    deliveryDate: Date,
    items: [{
      description: String,
      quantity: String,
      price: Number,
    }],
    measurement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required:[true, 'Kindly input customer Measurement']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Kindly enter total amount']
    },
    advancedPaid:{
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'in-progress', 'completed', 'delivered'],
      default: 'pending'
    },
    notes: String
    
  },
  { timeStamp: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
