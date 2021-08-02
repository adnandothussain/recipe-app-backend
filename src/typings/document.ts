import { Document } from 'mongoose';

export interface DocumentCommon extends Document {
  createdAt?: Date;
  updatedAt?: Date;
}
