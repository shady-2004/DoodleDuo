import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

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

  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "Password should be at least 8 characters"],
    select: false,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
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
module.exports = User;
