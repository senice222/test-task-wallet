import crypto from 'crypto';

export const generateWalletAddress = (): string => {
  return crypto.randomBytes(32).toString('hex');
}; 