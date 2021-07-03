import { schemaComposer } from 'graphql-compose';
import { composeMongoose } from 'graphql-compose-mongoose';
import moment from 'moment';
import Logger from '../../core/Logger';
import { RecipeModel } from '../../database/model/recipe.model';
import RecipeRepo from '../../database/repository/recipe.repo';

const RecipeTC = composeMongoose(RecipeModel);

const RecipeFeedResolverTC = schemaComposer.createResolver({
  type: [RecipeTC],
  args: {
    top: {
      type: 'Boolean',
      default: false,
    },
    recent: {
      type: 'Boolean',
      default: false,
    },
    byCusine: {
      type: 'Boolean',
      default: false,
    },
    trending: {
      type: 'Boolean',
      default: false,
    },
  },
  resolve: async ({ args }) => {
    try {
      const recipes = await RecipeRepo.findMany({
        dates: args.recent ? [moment().subtract(5, 'days').toDate(), new Date()] : undefined,
        top: Boolean(args.top),
      });
      return recipes;
    } catch (error) {
      Logger.warn(error);
      throw new Error('Unable to get top recipes');
    }
  },
});

const RecipeFeedTC = schemaComposer.createObjectTC({
  name: 'RecipeFeed',
});

RecipeFeedTC.addRelation('top');

// RecipeTC.addResolver({
//   name: 'recipeFeed',
//   type: RecipeFeedTC,
// });

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
