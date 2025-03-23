import userRespository from '../repository/userRepsitory.js';
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
