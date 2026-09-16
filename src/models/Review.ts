import mongoose, { Schema, models } from 'mongoose';

const ReviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  orderId: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, default: 'Verified customer' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 1000 },
}, { timestamps: true });

ReviewSchema.index({ productId: 1, orderId: 1 }, { unique: true });
export const Review = models.Review || mongoose.model('Review', ReviewSchema);
