import { Schema, model, Document } from 'mongoose';
import { defaultModelOptions } from './constant.model';

export const DOCUMENT_NAME = 'Restraunt';
export const COLLECTION_NAME = 'restraunts';

export default interface Restraunt extends Document {
  name: string;
  image: string;
  street: string;
  city: string;
  country: string;
  coords: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Restraunt>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    coords: {
      type: [Number],
      index: '2dsphere', // will allow us to use mongodb Geospatial Queries
    },
    tags: [
      {
        type: String,
        required: false,
        default: '',
      },
    ],
    priceRange: {
      type: String,
      required: true,
      default: '',
    },
  },
  {
    ...defaultModelOptions,
  },
);
schema.index({ 'location.geometry': '2dsphere' });
export const RestrauntModel = model<Restraunt>(DOCUMENT_NAME, schema, COLLECTION_NAME);
