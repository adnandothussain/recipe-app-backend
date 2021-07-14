import { schemaComposer } from 'graphql-compose';
import { RecipeTC, UserTC, searchRecipes, searchRestraunts } from './composers';
import { RecipeRequestTC, listRecipeRequests } from './composers/RecipeRequestTC';

schemaComposer.Query.addFields({
  recipes: RecipeTC.getResolver('recipeFeed'),
  searchRecipes,
  searchRestraunts,
  userById: UserTC.mongooseResolvers.findById(),
  listRecipeRequests,
});

schemaComposer.Mutation.addFields({
  requestRecipe: RecipeRequestTC.getResolver('requestRecipe'),
});

export default schemaComposer.buildSchema();
