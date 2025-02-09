import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [70, "First name must be less than 128 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [70, "First name must be less than 128 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return email.includes("@");
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      trim: true,
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [128, "Password must be less than 128 characters"],
      validate: {
        validator: function (password) {
          return /^[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      },
    },
  },
  { timestamps: true }
);

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
