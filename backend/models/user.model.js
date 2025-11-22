import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "client",
    },
    phone: {
      type: String,
    },
    profileImage: {
      type: String,
      default: null,
    },
    hasPaid: {
      type: Boolean,
      default: false,
    },
    paidPlan: { type: String },
    paidAmount: { type: Number },
    paymentDate: { type: Date },
    planExpiresAt: { type: Date },
    paymentHistory: [
      {
        amount: { type: Number, required: true },
        plan: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    serviceUsageCount: {
      type: Number,
      default: 0,
    },

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
