import mongoose from 'mongoose';

import { DEV_DB_URL, NODE_ENVIRONMENT, PROD_DB_URL } from './serverConfig.js';
export default async function connectDB() {
  try {
    if (NODE_ENVIRONMENT === 'development') {
      await mongoose.connect(DEV_DB_URL);
    } else if (NODE_ENVIRONMENT === 'production') {
      await mongoose.connect(PROD_DB_URL);
    }
    console.log(
      `Connected to mongodb database from ${NODE_ENVIRONMENT} environment`
    );
  } catch (error) {
    console.log(`An Error Occured while connecting to the Database`, error);
  }
}
