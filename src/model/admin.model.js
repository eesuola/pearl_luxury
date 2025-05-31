import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Replace 'bcrypt' with 'bcryptjs'
import jwt from "jsonwebtoken";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a first name"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 6,
    },
    role: String, //Admin, Customer

    //   profilePicture: {
    //   type: String,
    //   validate: {
    //     validator: function (v) {
    //       if (!v) return true; // Allow empty profilePicture

    //       // Regex to allow:
    //       // - Full URLs starting with http:// or https://
    //       // - Relative paths starting with optional '/'
    //       // - Filenames (e.g. 'image.jpg')
    //       const urlRegex = /^(https?:\/\/)/i;
    //       const relativePathRegex = /^\/?[\w\-./]+$/;

    //       return urlRegex.test(v) || relativePathRegex.test(v);
    //     },
    //     message: (props) => `${props.value} is not a valid URL or relative path for profile picture`,
    //   },
    //   default: "https://via.placeholder.com/150",
    // },

    passwordResetToken: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  console.log(salt);

  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt);
  }
});
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
const User = mongoose.model("User", UserSchema);
export default User;
// This code defines a Mongoose schema for a user in an e-commerce application. It includes fields for the user's first name, last name, username, email, and password. The password is hashed before saving to the database using bcrypt.
