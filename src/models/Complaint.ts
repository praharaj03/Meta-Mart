import mongoose, { Schema, models } from 'mongoose';

const ComplaintSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  userId: { type: String, default: 'guest', maxlength: 200 },
  subject: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
}, { timestamps: true });

ComplaintSchema.index({ createdAt: -1 });
export const Complaint = models.Complaint || mongoose.model('Complaint', ComplaintSchema);
