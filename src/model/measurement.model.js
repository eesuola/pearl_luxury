import mongoose from "mongoose";


const { Schema } = mongoose;

const MeasurementSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
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

    //Fabrics for Clients
    preferredFabrics: [String],
    stylePreference: String,
    allergies: String,},
  {
    timeStamp: true,
    toJSON: { virtual: true },
  }
);

const Measurement = mongoose.model("Measurement", MeasurementSchema);
export default Measurement;
