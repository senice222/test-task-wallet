import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

walletSchema.index({ userId: 1 });

export const Wallet = mongoose.model('Wallet', walletSchema); 