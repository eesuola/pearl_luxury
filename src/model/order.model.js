import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
  },
  items: [{
    description: String,
    quantity: Number,
    price: Number,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
export default Order;