import { schemaComposer } from 'graphql-compose';

const AuthorTC = schemaComposer.createObjectTC({
  name: 'Author',
  fields: {
    id: 'Int!',
    firstName: 'String',
    lastName: 'String',
  },
});

const PostTC = schemaComposer.createObjectTC({
  name: 'Post',
  fields: {
    id: 'Int!',
    title: 'String',
    votes: 'Int',
    authorId: 'Int',
  },
});

PostTC.addFields({
  author: {
    // you may provide type name as string 'Author',
    // but for better developer experience use Type instance `AuthorTC`
    // it allows to jump to type declaration via Ctrl+Click in your IDE
    type: AuthorTC,
    // resolve method as first argument will receive data for some Post
    // from this data you should somehow fetch Author's data
    // let's take lodash `find` method, for searching by `authorId`
    // PS. `resolve` method may be async for fetching data from DB
    // resolve: async (source, args, context, info) => { return DB.find(); }
    resolve: () => null,
  },
});

AuthorTC.addFields({
  posts: {
    // Array of posts may be described as string in SDL in such way '[Post]'
    // But graphql-compose allow to use Type instance wrapped in array
    type: [PostTC],
    // for obtaining list of post we get current author.id
    // and scan and filter all Posts with desired authorId
    resolve: () => [],
  },
});

schemaComposer.Query.addFields({
  posts: {
    type: '[Post]',
    resolve: () => [], // resolve the posts from the db
  },
  author: {
    type: 'Author',
    args: { id: 'Int!' },
    // resolve the author from the db
    resolve: () => [],
  },
});

// Requests which modify data put into Mutation
schemaComposer.Mutation.addFields({
  addPost: {
    type: 'Post',
    args: {
      title: 'String',
      votes: 'Int',
      authorId: 'Int',
    },
    resolve: (_, args) => {
      return { ...args, id: 1 };
    },
  },
});

// And now buildSchema which will be passed to express-graphql or apollo-server
export default schemaComposer.buildSchema();
