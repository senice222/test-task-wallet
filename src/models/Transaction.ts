import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  fromWallet: {
    type: String,
    required: true,
    ref: 'Wallet'
  },
  toWallet: {
    type: String,
    required: true,
    ref: 'Wallet'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

transactionSchema.index({ fromWallet: 1, toWallet: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ createdAt: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema); 