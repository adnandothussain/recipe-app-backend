import express from 'express';
import validator from '../validations';
import scheme from '../validations/scheme.validation';

const router = express.Router();

router.post('/login', validator(scheme.userCredential), () => {
  // todo in progress
});

export default router;
