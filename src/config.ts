import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const USER_ID_FILE = path.join(__dirname, '../.userid');

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'your mongo uri',
  services: {
    wallet: process.env.WALLET_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    transaction: process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003'
  },
  userId: process.env.USER_ID || (fs.existsSync(USER_ID_FILE) ? fs.readFileSync(USER_ID_FILE, 'utf-8') : undefined),
  setUserId(id: string) {
    this.userId = id;
    fs.writeFileSync(USER_ID_FILE, id);
  }
}; 