import { composeMongoose } from 'graphql-compose-mongoose';
import { RecipeTipModel } from '../../database/model/recipeTip.model';
import { UserTC } from './UserTC';

export const RecipeTipTC = composeMongoose(RecipeTipModel);

RecipeTipTC.addRelation('user', {
  resolver: () => UserTC.mongooseResolvers.findById(),
  prepareArgs: {
    _id: (source) => source.user,
  },
  projection: { user: 1 },
});
