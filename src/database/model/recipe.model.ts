import { Schema, model, Document } from 'mongoose';
import { defaultModelOptions } from './constant.model';
import { IIngredient, IRecipeTip } from '../../typings/recipe';
import User from './user.model';
import Restraunt from './restraunt.model';

export const DOCUMENT_NAME = 'Recipe';
export const COLLECTION_NAME = 'recipes';

export default interface Recipe extends Document {
  name: string;
  description: string;
  image: string;
  video: string;
  tags: string[];
  ingredients: IIngredient & { group: string }[];
  restraunts: Restraunt[];
  instructions: string[];
  // TODO, should be a seperate document for tips
  tips: IRecipeTip[];
  cookingTime: number; // in minutes
  serving: number; // no of peoples
  calories: number;
  createdBy: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Recipe>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    tags: [
      {
        type: String,
        required: false,
        default: '',
      },
    ],
    tips: [
      {
        text: { type: String, required: true },
        image: { type: String, required: false },
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
    ingredients: [
      {
        amount: { type: String, required: true },
        name: { type: String, required: true },
        group: { type: String, required: true, default: 'All ingredients' },
        substitutes: [{ type: String, required: false }],
      },
    ],
    restraunts: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Restraunt',
      },
    ],
    instructions: [
      {
        type: String,
        required: true,
        default: '',
      },
    ],
    cookingTime: {
      type: Number,
      required: false,
      default: 0,
    },
    serving: {
      type: Number,
      required: false,
      default: 0,
    },
    calories: {
      type: Number,
      required: false,
    },
  },
  {
    ...defaultModelOptions,
  },
);

export const RecipeModel = model<Recipe>(DOCUMENT_NAME, schema, COLLECTION_NAME);
