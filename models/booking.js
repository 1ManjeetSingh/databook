// models/Booking.js
import { model, models, Schema } from 'mongoose';

const bookingSchema = new Schema({
  diaryNumber: { type: String, required: true },
  bookingNumber: { type: String, default: "" },
  mobileNumber: { type: String, default: ""},
  name: { type: String, required: true },
  relativeName: { type: String, default: "" },
  relation: { type: String, enum: ['son', 'wife'], required: true },
  type: { type: String, enum: ['hp', 'bagadiya', 'bharatgas'], required: true },
  amount: { type: Number, required: true },
  paid: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = models?.Booking || model('Booking', bookingSchema);

export default Booking;
