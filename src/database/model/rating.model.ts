import { Schema, model, Document } from 'mongoose';
import { defaultModelOptions } from './constant.model';
import Recipe from './recipe.model';
import User from './user.model';

export const DOCUMENT_NAME = 'Rating';
export const COLLECTION_NAME = 'ratings';

export default interface Rating extends Document {
  user: User;
  recipe: Recipe;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Rating>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    recipe: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe',
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be between 1 - 5, got {VALUE}'],
      max: [5, 'Rating must be between 1 - 5, got {VALUE}'],
    },
  },
  {
    ...defaultModelOptions,
  },
);

schema.index({ user: 1, recipe: 1 }, { unique: true });
export const RatingModel = model<Rating>(DOCUMENT_NAME, schema, COLLECTION_NAME);
