import { Schema, model, Document } from 'mongoose';
import { defaultModelOptions } from './constant.model';
import User from './user.model';

export const DOCUMENT_NAME = 'RecipeTip';
export const COLLECTION_NAME = 'recipeTips';

export default interface RecipeTip extends Document {
  text: string;
  image: string;
  user: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<RecipeTip>(
  {
    text: { type: String, required: true },
    image: { type: String, required: false },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    ...defaultModelOptions,
  },
);

export const RecipeTipModel = model<RecipeTip>(DOCUMENT_NAME, schema, COLLECTION_NAME);
