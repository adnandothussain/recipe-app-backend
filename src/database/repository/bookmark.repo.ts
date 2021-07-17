import Bookmark, { BookmarkModel } from '../model/bookmark.model';

export default class BookmarkRepo {
  public static async create(payload: { recipeId: string; userId: string }): Promise<Bookmark> {
    const Bookmark = await BookmarkModel.create({
      user: payload.userId,
      recipe: payload.recipeId,
    });
    return Bookmark.toJSON() as Bookmark;
  }
}
