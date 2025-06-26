import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  secondName: string;
  sketches: any[];
  profile?: string | null;
  passwordChangedAt?: Date | null;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell use your name!"],
    trim: true,
    maxLength: [20, "A user name must have less or equal that 40 characters"],
  },
  secondName: {
    type: String,
    required: [true, "Please tell use your name!"],
    trim: true,
    maxLength: [20, "A user name must have less or equal that 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email should be a valid email format"],
  },

  profile: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "Password should be at least 8 characters"],
    select: false,
  },
  sketches: {
    type: [mongoose.Schema.Types.Mixed], // or a specific type or sub-schema
    validate: {
      validator: function (val: [mongoose.Schema.Types.Mixed]) {
        return val.length <= 6; // max 5 elements
      },
      message: "You can only store up to 6 sketches",
    },
  },

  passwordChangedAt: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10
    );
    return changedTimestamp > JWTTimeStamp;
  }
  return false;
};
const User = mongoose.model("User", userSchema);
export default User;
export type { IUser };
