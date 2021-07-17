import { schemaComposer } from 'graphql-compose';
import { RecipeTC, UserTC, searchRecipes, searchRestraunts, BookmarkTC } from './composers';
import { RecipeRequestTC, listRecipeRequests } from './composers/RecipeRequestTC';

schemaComposer.Query.addFields({
  recipes: RecipeTC.getResolver('recipeFeed'),
  userById: UserTC.mongooseResolvers.findById(),
  searchRecipes,
  searchRestraunts,
  listRecipeRequests,
});

schemaComposer.Mutation.addFields({
  requestRecipe: RecipeRequestTC.getResolver('requestRecipe'),
  createRecipe: RecipeTC.getResolver('createRecipe'),
  createBookmark: BookmarkTC.getResolver('createBookmark'),
});

export default schemaComposer.buildSchema();
