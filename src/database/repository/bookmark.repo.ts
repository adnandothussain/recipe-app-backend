import Bookmark, { BookmarkModel } from '../model/bookmark.model';

export default class BookmarkRepo {
  public static async create(payload: { recipeId: string; userId: string }): Promise<Bookmark> {
    const bookmark = await BookmarkModel.create({
      user: payload.userId,
      recipe: payload.recipeId,
    });
    return bookmark.toJSON() as Bookmark;
  }
  public static async checkIsBookmark(payload: {
    recipeId: string;
    userId: string;
  }): Promise<boolean> {
    const res = await BookmarkModel.findOne({
      recipe: payload.recipeId as any,
      user: payload.userId as any,
    });
    return res !== null;
  }
}
