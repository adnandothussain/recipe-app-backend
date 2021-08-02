import { Schema, model, Document } from 'mongoose';
import { defaultModelOptions } from './constant.model';
import User from './user.model';

export const DOCUMENT_NAME = 'RecipeRequest';
export const COLLECTION_NAME = 'recipeRequests';

export default interface RecipeRequest extends Document {
  user: User;
  description: string;
  image: string;
  likes: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<RecipeRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
    ],
  },
  {
    ...defaultModelOptions,
  },
);

export const RecipeRequestModel = model<RecipeRequest>(DOCUMENT_NAME, schema, COLLECTION_NAME);
