import { IIngredient } from '../../typings/recipe';
import Recipe, { RecipeModel } from '../model/recipe.model';

export interface IRecipeSeedData {
  name: string;
  description: string;
  image: string;
  rating?: number;
  tag?: string[];
  ingredient: IIngredient[];
  ingredientGroup?: { name: string; ingredient: IIngredient[] }[];
  restraunts?: string[];
  step: { description: string }[];
  cookingTime?: number; // in minutes
  serving?: number; // no of peoples
  calories?: number;
}

export const RecipeSeeds = async (dataSet: IRecipeSeedData[]) => {
  await RecipeModel.insertMany(
    dataSet.map((val) => {
      return {
        name: val.name,
        description: val.description,
        image: val.image,
        rating: val.rating || 0,
        tags: val.tag || [],
        ingredients: val.ingredientGroup?.some((val) => val.ingredient.length)
          ? (val.ingredientGroup.reduce(
              (acc, current) =>
                acc.concat(
                  current.ingredient.map((ing) => ({
                    ...ing,
                    group: current.name,
                    amount: ing.amount || '0',
                  })),
                ),
              [] as IIngredient[],
            ) as any[])
          : val.ingredient.map((ingredient: any) => ({
              amount: ingredient.amount || '0',
              name: ingredient.name || '0',
              group: ingredient.group,
            })),
        instructions: val.step.map((step) => step.description),
      } as Recipe;
    }),
  );
};
