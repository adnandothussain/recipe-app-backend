import { composeMongoose } from 'graphql-compose-mongoose';
import { UserModel } from '../../database/model/user.model';
import { RecipeTC } from './RecipeTC';

// @ts-ignore
export const UserTC = composeMongoose(UserModel);

UserTC.addRelation('recipes', {
  type: [RecipeTC],
  prepareArgs: {
    filter: (source) => ({
      user: source.id,
    }),
  },
  projection: {
    id: true,
  },
});
