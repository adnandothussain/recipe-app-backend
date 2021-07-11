import { composeMongoose } from 'graphql-compose-mongoose';
import { UserModel } from '../../database/model/user.model';
import { RecipeTC } from './RecipeTC';

// @ts-ignore
export const UserTC = composeMongoose(UserModel);

UserTC.addRelation('recipes', {
  resolver: () => RecipeTC.mongooseResolvers.connection({ name: 'userRecipes' }),
  prepareArgs: {
    filter: (source) => ({
      createdBy: source.id,
    }),
  },
  projection: {
    id: true,
  },
});
