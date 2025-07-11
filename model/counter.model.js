import mongoose from 'mongoose';
import Receipt from './receipt.model.js';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);
export default Counter


export const getNextSequenceValueSimple = async (sequenceName) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(async () => {
      // Get the current counter
      let counter = await Counter.findOne({ _id: sequenceName }).session(session);

      // Get the highest orderId in receipts
      const lastReceipt = await Receipt.findOne({}, { orderId: 1 })
        .sort({ orderId: -1 })
        .session(session)
        .lean();
      let lastSeq = 0;
      if (lastReceipt) {
        lastSeq = parseInt(lastReceipt.orderId.replace('ORD', ''), 10);
      }

      // If counter doesn't exist or is behind, sync it
      if (!counter || counter.sequence_value < lastSeq) {
        counter = await Counter.findOneAndUpdate(
          { _id: sequenceName },
          { $set: { sequence_value: lastSeq } },
          { new: true, upsert: true, session }
        );
      }

      // Now increment and return the new value
      counter = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, session }
      );
      return counter.sequence_value;
    });
  } finally {
    await session.endSession();
  }
};