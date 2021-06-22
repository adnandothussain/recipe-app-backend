import { ApolloServer } from 'apollo-server-express';
import config from './env';
import schema from '../schema';

export default class GraphQLServer {
  private apolloServer: ApolloServer;
  constructor() {
    this.apolloServer = new ApolloServer({
      schema,
      playground: {
        endpoint: '/graphql',
      },
      debug: config.env === 'development',
    });
  }

  getApolloServer() {
    if (this.apolloServer === null) {
      throw new Error('build the server before getting the server');
    }

    return this.apolloServer;
  }
}
