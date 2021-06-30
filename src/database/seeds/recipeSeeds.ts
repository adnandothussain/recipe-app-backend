import { IIngredient } from '../../typings/recipe';
import Recipe, { RecipeModel } from '../model/recipe.model';

export interface IRecipeSeedData {
  name: string;
  description: string;
  image: string;
  rating?: number;
  tags?: string[];
  ingredients: IIngredient[];
  ingredientGroup?: { name: string; ingredient: IIngredient[] }[];
  restraunts?: string[];
  instructions: string[];
  cookingTime?: number; // in minutes
  serving?: number; // no of peoples
  calories?: number;
}

export const RecipeSeeds = async (dataSet: IRecipeSeedData[]) => {
  const res = await RecipeModel.insertMany(
    dataSet.map(
      (val) =>
        ({
          name: val.name,
          description: val.description,
          image: val.image,
          rating: val.rating || 0,
          tags: val.tags || [],
          ingredients: val.ingredientGroup?.some((val) => val.ingredient.length)
            ? (val.ingredientGroup.reduce(
                (acc, current) =>
                  acc.concat(current.ingredient.map((ing) => ({ ...ing, group: current.name }))),
                [] as IIngredient[],
              ) as any[])
            : val.ingredients,
          instructions: val.instructions,
        } as Recipe),
    ),
  );
  // eslint-disable-next-line no-console
  console.log(
    'res=>',
    res.map((val) => val.toJSON()),
  );
};
