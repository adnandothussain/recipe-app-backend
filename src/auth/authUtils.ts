import { Types } from 'mongoose';

import { Tokens } from '../typings/jwt';
import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/JWT';
import User from '../database/model/user.model';
import config from '../config';
import UserRepo from '../database/repository/user.repo';

export const getAccessToken = (authorization?: string) => {
  if (!authorization) throw new AuthFailureError('Invalid Authorization');
  if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== config.token.TOKEN_ISSUER ||
    payload.aud !== config.token.TOKEN_AUDIENCE ||
    !Types.ObjectId.isValid(payload.sub)
  )
    throw new AuthFailureError('Invalid Access Token');
  return true;
};

export const createTokens = async (
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<Tokens> => {
  const accessToken = await JWT.encode(
    new JwtPayload(
      config.token.TOKEN_ISSUER,
      config.token.TOKEN_AUDIENCE,
      user.id!,
      accessTokenKey,
      config.token.ACCESS_TOKEN_VALIDITY_DAYS,
    ),
  );

  if (!accessToken) throw new InternalError();

  const refreshToken = await JWT.encode(
    new JwtPayload(
      config.token.TOKEN_ISSUER,
      config.token.TOKEN_AUDIENCE,
      user.id!,
      refreshTokenKey,
    ),
  );

  if (!refreshToken) throw new InternalError();

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  } as Tokens;
};

export async function getUserFromToken(tokenWithBearer: string) {
  const token = getAccessToken(tokenWithBearer);
  const tokenPayload = await JWT.validate(token);
  const user = UserRepo.findProfileById(tokenPayload.sub);
  if (user === null) {
    throw new AuthFailureError('User not found!');
  }
  return user;
}
