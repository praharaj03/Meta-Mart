import mongoose, { Schema, models } from 'mongoose';

const BlockedUserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  reason: { type: String, default: '' },
}, { timestamps: true });

export const BlockedUser = models.BlockedUser || mongoose.model('BlockedUser', BlockedUserSchema);
