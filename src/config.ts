import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const USER_ID_FILE = path.join(__dirname, '../.userid');

const readUserId = () => {
  if (fs.existsSync(USER_ID_FILE)) {
    const id = fs.readFileSync(USER_ID_FILE, 'utf-8').trim(); 
    console.log('Read userId from file:', id);
    return id;
  }
  return undefined;
};

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb+srv://asdfqqqwsf12311:io3ycEPY6SBhoYr0@cluster0.sg3c1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  services: {
    wallet: process.env.WALLET_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    transaction: process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003'
  },
  userId: process.env.USER_ID || readUserId(),
  setUserId(id: string) {
    this.userId = id;
    fs.writeFileSync(USER_ID_FILE, id);
    console.log('Saved userId:', id);
  }
};

// Добавим логирование текущего значения
console.log('Current userId:', config.userId); 