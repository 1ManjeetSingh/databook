// models/History.js
import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  type: String,
  diaryNumber: String,
  mobileNumber: String,
  bookingNumber: String,
  name: String,
  relativeName: String,
  relation: String,
  amount: Number,
  paid: Boolean,
  createdAt: Date,
  clearedDateString: String, // for grouping
}, { timestamps: true });

export default mongoose.models.History || mongoose.model("History", historySchema);
