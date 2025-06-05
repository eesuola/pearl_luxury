import mongoose from "mongoose";


const { Schema } = mongoose;
const CounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Counter = mongoose.model("Counter", CounterSchema);
export default Counter;