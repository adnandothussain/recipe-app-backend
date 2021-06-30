import { Types } from 'mongoose';

import Recipe, { RecipeModel } from '../model/recipe.model';

export default class RecipeRepo {
  public static findRecipe(id: string): Promise<Recipe | null> {
    return RecipeModel.findById(id).exec();
  }

  public static async remove(id: Types.ObjectId) {
    const doc = await RecipeModel.findByIdAndRemove(id).exec();
    return doc?.toJSON();
  }

  public static async create(payload: Recipe): Promise<Recipe> {
    const Recipe = await RecipeModel.create({
      ...payload,
    });
    return Recipe.toJSON() as Recipe;
  }
}
