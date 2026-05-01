import mongoose, { Schema, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  category: { type: String, required: true },
  badge: { type: String, default: 'New' },
}, { timestamps: true });

export const Product = models.Product || mongoose.model('Product', ProductSchema);
