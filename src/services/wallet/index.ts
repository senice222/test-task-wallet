import express from 'express';
import mongoose from 'mongoose';
import { config } from '../../config';
import { generateWalletAddress } from '../../utils/wallet';
import { Wallet } from '../../models/Wallet';

const app = express();
app.use(express.json());

app.post('/wallets', async (req, res) => {
  try {
    const { userId } = req.body;
    const address = generateWalletAddress();
    const wallet = new Wallet({
      address,
      userId,
      balance: 1000
    });
    await wallet.save();
    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

app.get('/wallets/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;
    console.log("userId", userId)
    const wallets = await Wallet.find({ userId });
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
});

mongoose.connect(config.mongoUri).catch(error => console.log(error));
app.listen(3001, () => console.log('Wallet service running on port 3001')); 