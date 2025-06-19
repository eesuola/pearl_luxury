import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

//hash password before saving
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);

  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const User = mongoose.model('User', UserSchema);

export default User;