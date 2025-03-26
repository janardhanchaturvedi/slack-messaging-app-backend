import jwt from 'jsonwebtoken';

import { JWT_EXPIRY, JWT_SECRET_KEY } from '../../config/serverConfig.js';

export const createJWT = (data) => {
  const token = jwt.sign(data, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRY
  });
  return token;
};
