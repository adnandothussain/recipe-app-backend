import express from 'express';
import cors from 'cors';
import GraphQLServer from './config/graphqlServer';

const app = express();

const graphQLServer = new GraphQLServer().getApolloServer();
graphQLServer.applyMiddleware({ app });

const { PORT } = process.env;
const APP_PORT = PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', async (_, res) => {
  res.send('Hello Web!');
});

app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is running at http://localhost:${APP_PORT}`);
});
