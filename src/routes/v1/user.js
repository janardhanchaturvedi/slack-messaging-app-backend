import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { signIn, signUp } from '../../controllers/userControllers.js';
import {
  userSignInSchema,
  userSignUpSchema
} from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';
const router = express.Router();

router.get('/', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'GET /users'
  });
});

router.post('/signup', validate(userSignUpSchema), signUp);

router.post('/signin', validate(userSignInSchema), signIn);

export default router;
