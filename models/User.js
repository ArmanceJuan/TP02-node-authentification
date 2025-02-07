import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [128, "Password must be less than 128 characters"],
  },
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
});

userSchema.methods.hashPassword = function (password) {
  return crypto
    .createHmac("sha256", process.env.HASH_SECRET)
    .update(password)
    .digest("hex");
};

userSchema.methods.comparePassword = function (password) {
  return this.password === this.hashPassword(password);
};

const User = mongoose.model("User", userSchema);

export default User;
