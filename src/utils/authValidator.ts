import { NextFunction } from 'express';
import { Types } from 'mongoose';
import { getAccessToken, validateTokenData } from '../auth/authUtils';
import { AuthFailureError } from '../core/ApiError';
import JWT from '../core/JWT';
import UserRepo from '../database/repository/user.repo';
import { ProtectedRequest } from '../typings/request';

export const AuthValidator = async (req: ProtectedRequest, _: any, next: NextFunction) => {
  const token = getAccessToken(req.headers.authorization);
  const accessTokenPayload = await JWT.decode(token);
  validateTokenData(accessTokenPayload);

  const user = await UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub));
  if (!user) throw new AuthFailureError('User not found');
  req.user = user;
  next();
};
