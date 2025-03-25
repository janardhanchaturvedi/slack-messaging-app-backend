import dotenv from 'dotenv';

dotenv.config();
export const PORT = process.env.PORT || 3000;

export const NODE_ENVIRONMENT = process.env.NODE_ENVIRONMENT || 'development';

export const DEV_DB_URL = process.env.DEV_DB_URL;

export const PROD_DB_URL = process.env.PROD_DB_URL;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const JWT_EXPIRY = process.env.JWT_EXPIRY;
