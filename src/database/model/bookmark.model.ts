import { Schema, model, Document } from 'mongoose';
import { defaultModelOptions } from './constant.model';
import Recipe from './recipe.model';
import User from './user.model';

export const DOCUMENT_NAME = 'Bookmark';
export const COLLECTION_NAME = 'bookmarks';

export default interface Bookmark extends Document {
  user: User;
  recipe: Recipe;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Bookmark>(
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
  },
  {
    ...defaultModelOptions,
  },
);

export const BookmarkModel = model<Bookmark>(DOCUMENT_NAME, schema, COLLECTION_NAME);
