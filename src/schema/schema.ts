import { schemaComposer } from 'graphql-compose';
import { RecipeTC, UserTC, searchRecipes, searchRestraunts } from './composers';
import { RecipeRequestTC } from './composers/RecipeRequestTC';

schemaComposer.Query.addFields({
  recipes: RecipeTC.getResolver('recipeFeed'),
  searchRecipes,
  searchRestraunts,
  userById: UserTC.mongooseResolvers.findById(),
});

// Requests which modify data put into Mutation
schemaComposer.Mutation.addFields({
  requestRecipe: RecipeRequestTC.getResolver('requestRecipe'),
});

// And now buildSchema which will be passed to express-graphql or apollo-server
export default schemaComposer.buildSchema();
