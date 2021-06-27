import Joi from '@hapi/joi';
import { JoiAuthBearer } from './validation';

export default {
  userCredential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    firstName: Joi.string().required().min(3),
    lastName: Joi.string().optional().min(3),
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    avatar: Joi.string().optional().uri(),
    gender: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
};
