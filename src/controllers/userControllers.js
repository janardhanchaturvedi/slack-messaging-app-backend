import { StatusCodes } from 'http-status-codes';

import { signInService, signUpService } from '../service/userService.js';
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

export const signIn = async (req, res) => {
  try {
    const response = await signInService(req.body);
    return res
      .status(StatusCodes.OK)
      .json(sucessResponse(response, 'User signed in sucessfully'));
  } catch (error) {
    console.log('🚀 ~ signIn ~ error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(error));
  }
};
