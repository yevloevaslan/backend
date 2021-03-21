import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import {UserCountQuery, UserQuery} from './grapqhl/users';
const adminApp = express();
import db from './db';
db();

const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        users: UserQuery,
        usersCount: UserCountQuery,
    },
});

const schema = new GraphQLSchema({query});

adminApp.use('/api/admin', graphqlHTTP({
    schema,
    graphiql: true,
}));
export default adminApp;

