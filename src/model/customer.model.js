import mongoose from "mongoose";
import bcryptjs from "bcryptjs"; // Replace 'bcrypt' with 'bcryptjs'
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const CustomerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, " Phone Number is required"],
      trim: true,
    },
    address: {
      type: String,
      city: String,
      state: String,
    },
    measurements: {
      //Basic Measurement
      neck: Number,
      shoulder: Number,
      waist: Number,
      halfLength: Number,

      //Front/Back Measurement
      acrossFront: Number,
      acrossBack: Number,

      //Bust Measurement
      bust: Number,
      bustCircumference: Number,
      shoulderToNipple: Number,
      bustSpan: Number,

      //Under Bust Measurement
      underBust: Number,
      underBustCircumference: Number,
      shoulderToUB: Number,

      // Garment Length
      blouseLength: Number,
      dressLength: {
        beforeKnee: Number,
        onKnee: Number,
        mid: Number,
        long: Number,
      },

      //Arm Measurements
      overArm: Number,
      sleeves: {
        sleeveLength: Number,
        sleeveRound: Number,
      },

      //Skirt measurements
      skirt: {
        skirtLength: Number,
        skirtWaist: Number,
      },

      //Hip Measurement
      hipCircumference: {
        upper: Number,
        lower: Number,
        hipLine: Number,
      },

      //Leg Measurements
      roundThigh: Number,
      knee: {
        length: Number,
        round: Number,
      },

      //Additional Measurement
      bar: Number,

      //Additional Data

      notes: String,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      takenBy: String,
    },

    //Fabrics for Clients
    preferredFabrics: [String],
    styePreference: String,
    allergies: String,

    //Client orders
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      currency: "NGN",
    },
    lastOrderDate: Date,

    //Status
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "active",
    },
    notes: String,
  },
  {
    timeStamp: true,
    toJSON: { virtual: true },
  }
);

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
