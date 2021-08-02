import { Types } from 'mongoose';
import Rating, { RatingModel } from '../model/rating.model';

export default class RatingRepo {
  public static async create(payload: Rating): Promise<Rating> {
    const Rating = await RatingModel.create({
      ...payload,
    });
    return Rating.toJSON() as Rating;
  }
  public static async getTotalRating(recipeId: string): Promise<number> {
    const response = await RatingModel.aggregate([
      {
        $match: {
          recipe: Types.ObjectId(recipeId),
        },
      },
      {
        $group: {
          _id: '$recipe',
          totalRatings: { $avg: '$rating' },
        },
      },
    ]);
    if (!response?.length) return 0;
    return response[0].totalRatings as number;
  }
}
