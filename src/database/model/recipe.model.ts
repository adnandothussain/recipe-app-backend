import { Schema, model, Document } from 'mongoose';
import { defaultModelOptions } from './constant.model';
import { IIngredient, IRecipeTip } from '../../typings/recipe';

export const DOCUMENT_NAME = 'Recipe';
export const COLLECTION_NAME = 'Recipes';

export default interface Recipe extends Document {
  name: string;
  description: string;
  image: string;
  rating: number;
  tags: string[];
  ingredients: IIngredient & { group: string }[];
  restraunts?: string[];
  instructions: string[];
  // TODO, should be a seperate document for tips
  tips: IRecipeTip[];
  cookingTime: number; // in minutes
  serving: number; // no of peoples
  calories: number;
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
    rating: {
      type: Number,
      required: false,
      default: 0,
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
        amount: { type: Number, required: true },
        name: { type: String, required: true },
        group: { type: String, required: false, default: 'All ingredients' },
      },
    ],
    restraunts: [
      {
        type: String,
        required: false,
        default: '',
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
