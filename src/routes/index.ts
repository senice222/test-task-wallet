import express from 'express';
import axios from 'axios';
import { config, readUserId } from '../config';
import { checkAuth } from '../middleware/auth';

const router = express.Router();

// PS: will be better to slice these routes to separate files
router.post('/wallets', async (req, res, next) => {
  try {
    const {data} = await axios.post(`${config.services.wallet}/wallets`, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/wallets', checkAuth, async (req, res, next) => {
  try {
    config.userId = readUserId();
    
    const {data} = await axios.get(`${config.services.wallet}/wallets/user/${config.userId}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/transactions', checkAuth, async (req, res, next) => {
  try {
    const transactionData = {
      ...req.body,
      userId: config.userId
    };
    const {data} = await axios.post(`${config.services.transaction}/transactions`, transactionData);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/transactions/:walletAddress', checkAuth, async (req, res, next) => {
  try {
    const {data} = await axios.get(
      `${config.services.transaction}/transactions/${req.params.walletAddress}`
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const {data} = await axios.post(`${config.services.user}/users`, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId', async (req, res, next) => {
  try {
    const {data} = await axios.get(`${config.services.user}/users/${req.params.userId}`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/wallets/all', checkAuth, async (req, res, next) => {
  try {
    const {data} = await axios.get(`${config.services.wallet}/wallets/all`);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export const routes = router; 