import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import UserQuery from './grapqhl/users';
const adminApp = express();
import db from './db';
db();

const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        users: UserQuery,
    },
});

const schema = new GraphQLSchema({query});

adminApp.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));
export default adminApp;

