import express, { Request, Response } from 'express';
import cors from 'cors';
import GraphQLServer from './config/graphqlServer';
import routes from './routes';
import { InitDb } from './database';
import { ApiError, InternalError } from './core/ApiError';
import config from './config';
import Logger from './core/Logger';

const app = express();
InitDb(); // Initialize the database
const graphQLServer = new GraphQLServer().getApolloServer();
graphQLServer.applyMiddleware({ app });

const { PORT } = process.env;
const APP_PORT = PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', routes);

app.get('/', async (_, res) => {
  res.send('Hello Web!');
});
app.use(function (err: Error, _: Request, res: Response, next: any) {
  if (err instanceof ApiError) {
    return ApiError.handle(err, res);
  }
  if (config.env === 'development') {
    Logger.error(err);
    return res.status(500).send(err.message);
  }
  ApiError.handle(new InternalError(), res);
  next(err);
});

app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is running at http://localhost:${APP_PORT}`);
});
