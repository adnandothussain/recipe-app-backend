import express from 'express';

import { AuthController } from '../controller/auth.controller';
import asyncHandler from '../utils/asyncHandler';
import { AuthValidator } from '../utils/authValidator';
import validator from '../validations';
import schema from '../validations/scheme.validation';
import { ValidationSource } from '../validations/validation';

const router = express.Router();

router.post('/login', validator(schema.userCredential), asyncHandler(AuthController.login));
router.post(
  '/refresh',
  validator(schema.auth, ValidationSource.HEADER),
  validator(schema.refreshToken),
  asyncHandler(AuthController.refreshToken),
);
router.post('/signup', validator(schema.userCredential), asyncHandler(AuthController.signup));
router.post(
  '/update',
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(AuthValidator),
  validator(schema.updateUserInfo),
  asyncHandler(AuthController.updateUser),
);

export default router;
