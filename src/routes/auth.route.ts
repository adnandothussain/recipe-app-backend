import express from 'express';

import { AuthController } from '../controller/auth.controller';
import asyncHandler from '../utils/asyncHandler';
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
router.post('/signup', validator(schema.signup), asyncHandler(AuthController.signup));

export default router;
