import { Types } from 'mongoose';
import RecipeRequest, { RecipeRequestModel } from '../model/request.model';

export default class RecipeRequestRepo {
  public static async create(payload: RecipeRequest): Promise<RecipeRequest> {
    const Recipe = await RecipeRequestModel.create({
      ...payload,
    });
    return Recipe.toJSON() as RecipeRequest;
  }
  public static async getRecipeRequestLikes(userId: string): Promise<number> {
    const payload = await RecipeRequestModel.aggregate([
      {
        $match: {
          user: Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: '$user',
          requests: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          likes: { $size: '$requests.likes' },
        },
      },
    ]);
    if (!payload?.length) return 0;
    return payload[0].likes as number;
  }
}
