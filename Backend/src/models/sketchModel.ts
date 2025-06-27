import mongoose from "mongoose";

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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default sketchSchema;
// export type { ISketch };
