import dotenv from 'dotenv';

dotenv.config();
export const PORT = process.env.PORT || 3000;

export const NODE_ENVIRONMENT = process.env.NODE_ENVIRONMENT || 'development';

export const DEV_DB_URL = process.env.DEV_DB_URL;

export const PROD_DB_URL = process.env.PROD_DB_URL;
