import { Schema, model } from 'mongoose';
import { DocumentCommon } from '../../typings/document';
import { defaultModelOptions } from './constant.model';

export const DOCUMENT_NAME = 'Category';
export const COLLECTION_NAME = 'categories';

export default interface Category extends DocumentCommon {
  name: string;
  image: string;
}

const schema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    ...defaultModelOptions,
  },
);

export const CategoryModel = model<Category>(DOCUMENT_NAME, schema, COLLECTION_NAME);
