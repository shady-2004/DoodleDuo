import mongoose from "mongoose";
import validator from "validator";

// export interface ISketch {
//   _id?: string;
//   data: any;
//   createdAt?: Date;
// }

const sketchSchema = new mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed,
  },
  name: {
    type: String,
    required: [true, "Please provide a name for the sketch."],
    trim: true,
    maxLength: [20, "A sketch name must have less or equal than 50 characters"],
    unique: [true, "There is already a sketch with that name"],
  },
  picture: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtkKmZkPPTb11OJR_GZl-3WgJW4PiWST4aWg&s",
    validate: {
      validator: function (val: string) {
        return validator.isURL(val);
      },
      message: "Please provide a valid image URL for the sketch picture.",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default sketchSchema;
// export type { ISketch };
