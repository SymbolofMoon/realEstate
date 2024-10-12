import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  dbUri: process.env.DATABASE_URL,
  secretKey: process.env.SECRET_KEY,
};

export default config;