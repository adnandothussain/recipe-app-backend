import RecipeRequest, { RecipeRequestModel } from '../model/request.model';

export default class RecipeRequestRepo {
  public static async create(payload: RecipeRequest): Promise<RecipeRequest> {
    const Recipe = await RecipeRequestModel.create({
      ...payload,
    });
    return Recipe.toJSON() as RecipeRequest;
  }
}
