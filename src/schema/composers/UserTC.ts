import { composeMongoose } from 'graphql-compose-mongoose';
import { UserModel } from '../../database/model/user.model';
import { BookmarkTC } from './BookmarkTC';
import { listRecipeRequests } from './RecipeRequestTC';
import { RecipeTC } from './RecipeTC';
import RecipeRequestRepo from '../../database/repository/request.repo';

// @ts-ignore
export const UserTC = composeMongoose(UserModel);

UserTC.addRelation('recipes', {
  resolver: () => RecipeTC.mongooseResolvers.connection({ name: 'userRecipes' }),
  prepareArgs: {
    filter: (source) => ({
      createdBy: source._id,
    }),
  },
  projection: {
    _id: true,
  },
});

UserTC.addRelation('recipeRequests', {
  resolver: () => listRecipeRequests,
  prepareArgs: {
    filter: (source) => ({
      user: source._id,
    }),
  },
  projection: {
    _id: true,
  },
});

UserTC.addRelation('bookmars', {
  resolver: () => BookmarkTC.mongooseResolvers.connection({ name: 'recipeBookmarks' }),
  prepareArgs: {
    filter: (source) => ({
      user: source._id,
    }),
  },
  projection: {
    _id: true,
  },
});

UserTC.addRelation('noOfRecipes', {
  resolver: () => RecipeTC.mongooseResolvers.count(),
  prepareArgs: {
    filter: (source) => ({ createdBy: source._id }),
  },
  projection: {
    _id: true,
  },
});

UserTC.addFields({
  likeRequests: {
    type: 'Int!',
    resolve: async (source: any) => {
      const res = await RecipeRequestRepo.getRecipeRequestLikes(source._id);
      return res;
    },
  },
});
