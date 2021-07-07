import { schemaComposer } from 'graphql-compose';
import { RecipeTC } from './composers';

schemaComposer.Query.addFields({
  recipes: RecipeTC.getResolver('recipeFeed'),
});

// Requests which modify data put into Mutation
schemaComposer.Mutation.addFields({
  addPost: {
    type: 'String!',
    args: {
      title: 'String',
      votes: 'Int',
      authorId: 'Int',
    },
    resolve: () => {
      return '1';
    },
  },
});

// And now buildSchema which will be passed to express-graphql or apollo-server
export default schemaComposer.buildSchema();
