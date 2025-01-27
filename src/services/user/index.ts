import express from 'express';
import mongoose from 'mongoose';
import { config } from '../../config';
import { User } from '../../models/User';

const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
  try {
    const { username } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username });
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

mongoose.connect(config.mongoUri);
app.listen(3002, () => console.log('User service running on port 3002')); 