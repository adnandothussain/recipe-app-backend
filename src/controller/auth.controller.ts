import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Types } from 'mongoose';
import _ from 'lodash';

import { AuthFailureError, BadRequestError } from '../core/ApiError';
import UserRepo from '../database/repository/user.repo';
import KeystoreRepo from '../database/repository/keystore.repo';
import { SuccessResponse, TokenRefreshResponse } from '../core/ApiResponse';
import { createTokens, getAccessToken, validateTokenData } from '../auth/authUtils';
import { ProtectedRequest } from '../typings/request';
import JWT from '../core/JWT';
import User from '../database/model/user.model';

const login = async (req: Request, res: Response) => {
  const user = await UserRepo.findByEmail(req.body.email);
  if (!user) throw new BadRequestError('User not registered');
  if (!user.password) throw new BadRequestError('Credential not set');

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) throw new AuthFailureError('Authentication failure');

  const accessTokenKey = crypto.randomBytes(64).toString('hex');
  const refreshTokenKey = crypto.randomBytes(64).toString('hex');

  await KeystoreRepo.create(user.id!, accessTokenKey, refreshTokenKey);
  const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

  new SuccessResponse('Login Success', {
    user: _.pick(user, ['id', 'name', 'email', 'avatar']),
    tokens: tokens,
  }).send(res);
};

const refreshToken = async (req: ProtectedRequest, res: Response) => {
  req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

  const accessTokenPayload = await JWT.decode(req.accessToken);
  validateTokenData(accessTokenPayload);

  const user = await UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub));
  if (!user) throw new AuthFailureError('User not registered');
  req.user = user;

  const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
  validateTokenData(refreshTokenPayload);

  if (accessTokenPayload.sub !== refreshTokenPayload.sub)
    throw new AuthFailureError('Invalid access token');

  const keystore = await KeystoreRepo.find(
    req.user.id!,
    accessTokenPayload.prm,
    refreshTokenPayload.prm,
  );

  if (!keystore) throw new AuthFailureError('Invalid access token');
  await KeystoreRepo.remove(keystore._id);

  const accessTokenKey = crypto.randomBytes(64).toString('hex');
  const refreshTokenKey = crypto.randomBytes(64).toString('hex');

  await KeystoreRepo.create(req.user.id!, accessTokenKey, refreshTokenKey);
  const tokens = await createTokens(req.user, accessTokenKey, refreshTokenKey);

  new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
};

const signup = async (req: ProtectedRequest, res: Response) => {
  const user = await UserRepo.findByEmail(req.body.email);
  if (user) throw new BadRequestError('User already registered');

  const accessTokenKey = crypto.randomBytes(64).toString('hex');
  const refreshTokenKey = crypto.randomBytes(64).toString('hex');
  const passwordHash = await bcrypt.hash(req.body.password, 10);

  const { user: createdUser, keystore } = await UserRepo.create(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      avatar: req.body.avatar,
      gender: req.body.gender,
      password: passwordHash,
    } as User,
    accessTokenKey,
    refreshTokenKey,
  );

  const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);
  new SuccessResponse('Signup Successful', {
    user,
    tokens: tokens,
  }).send(res);
};

export const AuthController = {
  login,
  signup,
  refreshToken,
};
