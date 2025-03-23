import { StatusCodes } from 'http-status-codes';

import { signUpService } from '../service/userService.js';
import {
  customErrorResponse,
  internalServerError,
  sucessResponse
} from '../utils/common/responseObjects.js';

export const signUp = async (req, res) => {
  try {
    const response = await signUpService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(sucessResponse(response, 'User Created Sucessfully'));
  } catch (error) {
    console.log('🚀 User Service ~ signUp ~ error:', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(error));
  }
};
