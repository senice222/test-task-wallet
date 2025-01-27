import express from 'express';
import axios from 'axios';
import { config } from '../config';

const router = express.Router();

// PS: will be better to slice these routes to separate files
router.post('/wallets', async (req, res, next) => {
  try {
    const response = await axios.post(`${config.services.wallet}/wallets`, req.body);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.get('/wallets', async (req, res, next) => {
  try {
    if (!config.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const response = await axios.get(`${config.services.wallet}/wallets/user/${config.userId}`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.post('/transactions', async (req, res, next) => {
  try {
    if (!config.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const transactionData = {
      ...req.body,
      userId: config.userId
    };
    const response = await axios.post(`${config.services.transaction}/transactions`, transactionData);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.get('/transactions/:walletAddress', async (req, res, next) => {
  try {
    if (!config.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const response = await axios.get(
      `${config.services.transaction}/transactions/${req.params.walletAddress}`
    );
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const response = await axios.post(`${config.services.user}/users`, req.body);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId', async (req, res, next) => {
  try {
    const response = await axios.get(`${config.services.user}/users/${req.params.userId}`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

export const routes = router; 