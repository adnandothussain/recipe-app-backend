import { composeMongoose } from 'graphql-compose-mongoose';
import { ResolverResolveParams, schemaComposer } from 'graphql-compose';
import Logger from '../../core/Logger';
import RecipeRepo from '../../database/repository/recipe.repo';
import { RecipeModel } from '../../database/model/recipe.model';
import { UserTC } from './UserTC';

export const RecipeTC = composeMongoose(RecipeModel);

// const RecipesResolverTC = schemaComposer.createResolver({
//   type: [RecipeTC],
//   args: {
//     top: {
//       type: 'Boolean',
//       default: false,
//     },
//     recent: {
//       type: 'Boolean',
//       default: false,
//     },
//     byCusine: {
//       type: 'Boolean',
//       default: false,
//     },
//     trending: {
//       type: 'Boolean',
//       default: false,
//     },
//   },
//   resolve: async ({ args }) => {
//     try {
//       const recipes = await RecipeRepo.findMany({
//         dates: args.recent ? [moment().subtract(5, 'days').toDate(), new Date()] : undefined,
//         top: Boolean(args.top),
//       });
//       return recipes;
//     } catch (error) {
//       Logger.warn(error);
//       throw new Error('Unable to get top recipes');
//     }
//   },
// });

const RecipeFeedTC = schemaComposer.createObjectTC({
  name: 'RecipeFeed',
  fields: {
    // hasData: 'Boolean!',
    top: [RecipeTC],
    recent: [RecipeTC],
  },
});

// RecipeFeedTC.addRelation('top', {
//   resolver: () => RecipesResolverTC,
//   type: () => [RecipeTC],
//   prepareArgs: {
//     top: true,
//   },
// });

// RecipeFeedTC.addRelation('recent', {
//   resolver: () => RecipesResolverTC,
//   type: () => [RecipeTC],
//   prepareArgs: {
//     recent: true,
//   },
// });

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
        limit: 8,
      });
      const recentRecipes = await RecipeRepo.findMany({
        sort: { updatedAt: -1 },
        limit: 10,
      });
      return { top: topRecipes, recent: recentRecipes };
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

// const RecipesITC = schemaComposer.createInputTC({
//   name: 'RecipesFilter',
//   fields: {
//     top: {
//       type: 'Boolean',
//       default: false,
//     },
//     recent: {
//       type: 'Boolean',
//       default: false,
//     },
//     byCusine: {
//       type: 'Boolean',
//       default: false,
//     },
//     trending: {
//       type: 'Boolean',
//       default: false,
//     },
//   },
// });

// RecipeTC.mongooseResolvers
//   .connection({
//     name: 'recipesList',
//   })
//   .wrap((rp) => {
//     rp.addArgs({
//       recipesFilter: {
//         type: 'RecipesFilter!',
//         description: 'Filter for recipes',
//       },
//     });
//     return rp;
//   })
//   .wrapResolve((next) => (rp) => {
//     const args = rp.arg as any;
//     const filter: any = {
//       OR: [],
//     };
//     const { top, recent } = args.recipesFilter;
//     if (top) {
//       filter.OR.push({ _operators: { rating: { gte: 4 } } });
//     }
//     if (recent) {
//       filter.OR.push({
//         _operators: { createdAt: { gte: moment().subtract(5, 'days').toDate(), lte: new Date() } },
//       });
//     }
//     return next(rp);
//   });
