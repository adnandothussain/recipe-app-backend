import { Types, FilterQuery } from 'mongoose';

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
  public static async findMany({
    dates,
    top,
  }: {
    dates?: Date[];
    top?: boolean;
  }): Promise<Recipe[]> {
    const filter: FilterQuery<Recipe> = {
      $or: [],
    };
    if (dates?.[0] && dates?.[1]) {
      filter.$or?.push({
        createdAt: {
          $gte: dates[0],
          $lte: dates[1],
        },
      });
    }
    if (top) {
      filter.$or?.push({ rating: { $gte: 4 } });
    }
    if (!filter.$or?.length) delete filter.$or;
    const recipes = await RecipeModel.find(filter);
    return recipes.map((recipe) => recipe.toJSON()) as Recipe[];
  }
}
