import Joi from '@hapi/joi';
import { Gender } from '../database/model/constant.model';
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
  updateUserInfo: Joi.object().keys({
    firstName: Joi.string().required().min(3),
    lastName: Joi.string().allow('').optional(),
    username: Joi.string().required().min(3),
    avatar: Joi.string().optional().uri(),
    gender: Joi.string()
      .valid(...Object.values(Gender))
      .optional(),
  }),
};
