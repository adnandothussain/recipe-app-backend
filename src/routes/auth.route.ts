import express from 'express';

import { AuthController } from '../controller/auth.controller';
import validator from '../validations';
import schema from '../validations/scheme.validation';
import { ValidationSource } from '../validations/validation';

const router = express.Router();

router.post('/login', validator(schema.userCredential), AuthController.login);
router.post(
  '/refresh',
  validator(schema.auth, ValidationSource.HEADER),
  validator(schema.refreshToken),
  AuthController.refreshToken,
);
router.post('/signup', validator(schema.signup), AuthController.signup);

export default router;
