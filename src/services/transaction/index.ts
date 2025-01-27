import express from 'express';
import mongoose from 'mongoose';
import { config } from '../../config';
import { Transaction } from '../../models/Transaction';
import { Wallet } from '../../models/Wallet';

const app = express();
app.use(express.json());

app.post('/transactions', async (req, res) => {
  try {
    const { fromWallet, toWallet, amount, userId } = req.body;

    const sourceWallet = await Wallet.findOne({ address: fromWallet });
    const targetWallet = await Wallet.findOne({ address: toWallet });
    console.log(sourceWallet, targetWallet)
    if (!sourceWallet || !targetWallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    if (sourceWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    const transaction = new Transaction({
      fromWallet,
      toWallet,
      amount,
      userId,
      status: 'pending'
    });

    sourceWallet.balance -= amount;
    targetWallet.balance += amount;

    await Promise.all([
      transaction.save(),
      sourceWallet.save(),
      targetWallet.save()
    ]);

    transaction.status = 'completed';
    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ error: 'Failed to process transaction' });
  }
});

app.get('/transactions/:walletAddress', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { fromWallet: req.params.walletAddress },
        { toWallet: req.params.walletAddress }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.get('/transactions/user/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('fromWallet')
      .populate('toWallet');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

mongoose.connect(config.mongoUri);
app.listen(3003, () => console.log('Transaction service running on port 3003')); 