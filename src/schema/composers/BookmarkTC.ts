import { composeMongoose } from 'graphql-compose-mongoose';
import Logger from '../../core/Logger';
import { BookmarkModel } from '../../database/model/bookmark.model';
import BookmarkRepo from '../../database/repository/bookmark.repo';
import { RecipeTC } from './RecipeTC';
import { UserTC } from './UserTC';

export const BookmarkTC = composeMongoose(BookmarkModel);

BookmarkTC.addRelation('user', {
  resolver: () => UserTC.mongooseResolvers.findById(),
  prepareArgs: {
    _id: (source) => source.user,
  },
  projection: {
    user: true,
  },
});

BookmarkTC.addRelation('recipe', {
  resolver: () => RecipeTC.mongooseResolvers.findById(),
  prepareArgs: {
    _id: (source) => source.recipe,
  },
  projection: {
    recipe: true,
  },
});

BookmarkTC.addResolver({
  name: 'createBookmark',
  type: 'Bookmark!',
  args: {
    recipeId: 'MongoID!',
  },
  resolve: async ({ args: { recipeId }, context }: any) => {
    try {
      const newBookmark = await BookmarkRepo.create({
        userId: context.user._id,
        recipeId,
      });
      return newBookmark;
    } catch (error) {
      Logger.error('createBookmark error: ', error);
      throw error;
    }
  },
});
