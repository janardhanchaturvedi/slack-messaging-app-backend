import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import userRespository from '../repository/userRepsitory.js';
import { createJWT } from '../utils/common/authUtils.js';
import clientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const signUpService = async (user) => {
  try {
    const newUser = await userRespository.create(user);
    return newUser;
  } catch (error) {
    console.log('User service error', error);
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors1
        },
        error.message
      );
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['A user with same email or username already existss']
        },
        'A user with same email or username already exists'
      );
    }
  }
};

export const signInService = async (userData) => {
  try {
    const user = await userRespository.getByEmail(userData?.email);
    if (!user) {
      throw new clientError({
        explanation: 'Invalid data is send from the client',
        message: 'No registered user found with this email',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMatch = await bcrypt.compareSync(userData.password, user.password);
    if (!isMatch) {
      throw new clientError({
        explanation: 'Invalid Data is send from the client',
        message: 'Invalid passoword please try again',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
    return {
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      token: createJWT({ id: user?._id, email: user.email })
    };
  } catch (error) {
    console.log('User service error', error);
    throw error;
  }
};
