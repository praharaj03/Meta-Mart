import mongoose, { Schema, models } from 'mongoose';

const OrderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  userName: { type: String },
  items: [{ id: String, name: String, price: Number, image: String, quantity: Number }],
  total: { type: Number, required: true },
  address: { type: String },
  status: { type: String, default: 'confirmed' },
  stripeSessionId: { type: String },
}, { timestamps: true });

export const Order = models.Order || mongoose.model('Order', OrderSchema);
