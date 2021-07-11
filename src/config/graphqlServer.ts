import { ApolloServer } from 'apollo-server-express';
import { Request } from 'express';

import config from './env';
import schema from '../schema';
import { getUserFromToken } from '../auth/authUtils';

async function getContext(req: Request) {
  const user = await getUserFromToken(req.headers.authorization || '');
  return {
    user,
  };
}

export default class GraphQLServer {
  private apolloServer: ApolloServer;
  constructor() {
    this.apolloServer = new ApolloServer({
      schema,
      playground: {
        endpoint: '/graphql',
      },
      debug: config.env === 'development',
      context: async ({ req, connection }) => {
        if (connection) {
          // check connection for metadata
          return connection.context;
        }
        return getContext(req);
      },
      // TODO, NEED TO HANDLE ERROR FORMAT
      // SO WE WILL GET THE SAME ERROR FORMAT
      // formatError:
    });
  }

  getApolloServer() {
    if (this.apolloServer === null) {
      throw new Error('build the server before getting the server');
    }
    return this.apolloServer;
  }
}
