import { StatusCodes } from 'http-status-codes';
import jwt  from 'jsonwebtoken';

import { JWT_SECRET_KEY } from '../config/serverConfig.js';
import userRepository from '../repository/userRepsitory.js';
import {
  customErrorResponse,
  internalServerError
} from '../utils/common/responseObjects.js';
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(customErrorResponse({ message: 'No auth provided' }));
    }

    const response = jwt.verify(token, JWT_SECRET_KEY);

    if (!response) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data is send from the client',
          message: 'Invalid auth token provided'
        })
      );
    }

    const user = await userRepository.getById(response.id);
    req.user = user.id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explanation: 'Invalid data sent from the client',
          message: 'Invalid token provided'
        })
      );
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(error));
  }
};
