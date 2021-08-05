import { schemaComposer } from 'graphql-compose';
import composeWithRelay, {
  TypeMapForRelayNode,
  getNodeInterface,
  toGlobalId,
  // @ts-ignore
} from 'graphql-compose-relay';

import { RecipeTC, UserTC, searchRecipes, searchRestraunts, BookmarkTC } from './composers';
import { RecipeRequestTC, listRecipeRequests } from './composers/RecipeRequestTC';

composeWithRelay(schemaComposer.Query);
[UserTC].forEach((tc) => {
  tc.addInterface(getNodeInterface(schemaComposer));
  /**
   * The following two steps are necessary for relay to be able to resolve
   * any type that implements Node interface. Without these two steps we are not
   * able to query for a record using the global ID. This is also problematic
   * when using refetchable features of relay that rely on global ID
   */
  const findById = tc.mongooseResolvers.findById();
  TypeMapForRelayNode[tc.getTypeName()] = {
    resolver: findById,
    tc,
  };
  tc.addFields({
    id: {
      type: 'ID!',
      description: 'The globally unique ID among all types',
      resolve: (source: any) => toGlobalId(tc.getTypeName(), tc.getRecordId(source)),
    },
  });
  tc.setRecordIdFn((source) => source._id);
});

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
  rateRecipe: RecipeTC.getResolver('rateRecipe'),
});

export default schemaComposer.buildSchema();
