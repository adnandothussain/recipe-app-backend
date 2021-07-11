import { schemaComposer } from 'graphql-compose';
import { composeMongoose } from 'graphql-compose-mongoose';

import RecipeRequest, { RecipeRequestModel } from '../../database/model/request.model';
import RecipeRequestRepo from '../../database/repository/request.repo';
import { UserTC } from './UserTC';

export const RecipeRequestTC = composeMongoose(RecipeRequestModel);

RecipeRequestTC.addRelation('user', {
  resolver: () => UserTC.mongooseResolvers.findById(),
  prepareArgs: {
    _id: (source) => source.user,
  },
  projection: { user: 1 },
});

const RequestRecipeInputTC = schemaComposer.createInputTC({
  name: 'RequestRecipeInput',
  fields: {
    description: 'String!',
    image: 'String',
  },
});

RecipeRequestTC.addResolver({
  name: 'requestRecipe',
  type: () => RecipeRequestTC,
  args: {
    input: RequestRecipeInputTC,
  },
  // @ts-ignore
  resolve: async ({
    args: { input },
    context,
  }: {
    args: { input: { description: string; image: string } };
    context: any;
  }) => {
    const recipeRequest = await RecipeRequestRepo.create({
      ...input,
      user: context.user._id,
    } as RecipeRequest);
    return recipeRequest;
  },
});
