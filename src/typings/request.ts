import { Request } from 'express';
import User from '../database/model/user.model';
import Keystore from '../database/model/keystore.model';

export interface PublicRequest extends Request {
  apiKey: string;
}

export interface RoleRequest extends PublicRequest {
  currentRoleCode: string;
}

export interface ProtectedRequest extends RoleRequest {
  user: User;
  accessToken: string;
  keystore: Keystore;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
