import { composeMongoose } from 'graphql-compose-mongoose';
import { ResolverResolveParams, schemaComposer } from 'graphql-compose';
import Logger from '../../core/Logger';
import RecipeRepo from '../../database/repository/recipe.repo';
import Recipe, { RecipeModel } from '../../database/model/recipe.model';
import { UserTC } from './UserTC';
import RatingRepo from '../../database/repository/rating.repo';
import Rating from '../../database/model/rating.model';
import { BadRequestError, NotFoundError } from '../../core/ApiError';
import { CategoryModel } from '../../database/model/category.model';

export const RecipeTC = composeMongoose(RecipeModel);

RecipeTC.removeField('_id');

const RecipeFeedTC = schemaComposer.createObjectTC({
  name: 'RecipeFeed',
  fields: {
    top: [RecipeTC],
    recent: [RecipeTC],
    cusines: [RecipeTC],
  },
});

RecipeTC.addFields({
  id: {
    type: 'ID!',
    resolve: async (source: Recipe) => source.id,
  },
  totalRating: {
    type: 'Float!',
    resolve: async (source: Recipe) => {
      return await RatingRepo.getTotalRating(source._id);
    },
  },
});

RecipeTC.addRelation('createdBy', {
  resolver: () => UserTC.mongooseResolvers.findById(),
  prepareArgs: {
    _id: (source) => source.createdBy,
  },
  projection: { createdBy: 1 },
});

RecipeTC.addResolver({
  name: 'recipeFeed',
  type: RecipeFeedTC,
  args: {
    top: {
      type: 'Boolean',
      default: false,
    },
    recent: {
      type: 'Boolean',
      default: false,
    },
    cusines: {
      type: 'Boolean',
      default: false,
    },
    trending: {
      type: 'Boolean',
      default: false,
    },
  },
  resolve: async ({ args }: { args: { recent?: boolean; top?: boolean } }) => {
    try {
      const topRecipes = await RecipeRepo.findMany({
        top: Boolean(args.top),
        limit: 10,
      });
      const recentRecipes = await RecipeRepo.findMany({
        sort: { updatedAt: -1 },
        limit: 10,
      });
      const cusines = await CategoryModel.find({}, null, { sort: { name: 1 } });
      return { top: topRecipes, recent: recentRecipes, cusines };
    } catch (error) {
      Logger.warn(error);
      throw new Error('Unable to get top recipes');
    }
  },
});

export const searchRecipes = RecipeTC.mongooseResolvers
  .connection({ name: 'searchRecipes' })
  .wrap((rp) => {
    rp.addArgs({
      queryString: {
        type: 'String',
        defaultValue: null,
        description: 'query string',
      },
    });
    return rp;
  })
  .wrapResolve(
    (next) =>
      (rp: ResolverResolveParams<unknown, any, { queryString: string | null; filter: any }>) => {
        const filters: any = {
          OR: [],
        };
        if (rp.args.queryString != null) {
          const { queryString } = rp.args;
          filters.OR = [
            {
              _operators: {
                name: { regex: new RegExp(queryString, 'i') },
              },
            },
            {
              _operators: {
                description: { regex: new RegExp(queryString, 'i') },
              },
            },
            {
              _operators: { tags: { in: new RegExp(queryString, 'i') } },
            },
            {
              _operators: {
                ingredients: { $elemMatch: { name: { regex: new RegExp(queryString, 'i') } } },
              },
            },
          ];
        }
        if (!filters.OR.length) delete filters.OR;
        rp.args.filter = filters;
        return next(rp);
      },
  );

schemaComposer.createInputTC({
  name: 'RecipeIngredientInput',
  fields: {
    name: 'String!',
    amount: 'String!',
    group: 'String!',
  },
});
schemaComposer.createInputTC({
  name: 'CreateRecipeInput',
  fields: {
    name: 'String!',
    description: {
      type: 'String',
      defaultValue: '',
    },
    image: 'String!',
    tags: '[String!]',
    ingredients: '[RecipeIngredientInput!]!',
    instructions: '[String!]!',
    restraunts: '[MongoID!]',
    cookingTime: 'Int',
    serving: 'Int',
    calories: 'Int',
  },
});

RecipeTC.addResolver({
  name: 'createRecipe',
  type: 'Recipe!',
  args: {
    input: 'CreateRecipeInput!',
  },
  resolve: async ({ args: { input }, context }: any) => {
    try {
      const newRecipe = await RecipeRepo.create({
        ...input,
        createdBy: context.user._id,
      } as Recipe);
      return newRecipe;
    } catch (error) {
      Logger.error('createRecipe error: ', error);
      throw error;
    }
  },
});

RecipeTC.addResolver({
  name: 'rateRecipe',
  type: 'Int!',
  args: {
    recipeId: 'MongoID!',
    rating: 'Int!',
  },
  resolve: async ({ args: { recipeId, rating }, context }: any) => {
    try {
      const recipe = await RecipeModel.findById(recipeId);
      if (recipe === null) {
        throw new NotFoundError('No recipe found'); // 404 Error
      }
      if (recipe.createdBy === context.user._id) {
        throw new BadRequestError('Cannot rate your own created recipe');
      }
      await RatingRepo.create({
        user: context.user._id,
        recipe: recipeId,
        rating: rating,
      } as Rating);
      return rating;
    } catch (error) {
      Logger.error('rateRecipe error: ', error);
      throw error;
    }
  },
});
