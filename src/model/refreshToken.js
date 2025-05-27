import mongoose from "mongoose";

const { Schema } = mongoose;


const RefreshTokenSchema  = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  expiresAt: Date,
});

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
export default RefreshToken;

// const SalesRecord = mongoose.model("SalesRecord", SalesRecordSchema);
// export default SalesRecord;