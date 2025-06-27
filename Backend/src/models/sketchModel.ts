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
    required: true,
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
