import express from 'express';
import {graphqlHTTP} from 'express-graphql';
// import {GraphQLObjectType, GraphQLSchema} from 'graphql';
// import {UserCountQuery, UserQuery} from './grapqhl/queries.ts/users';
const adminApp = express();
import db from './db';
db();
import {schema, root} from './grapqhl/schema';

adminApp.use('/api/admin', graphqlHTTP((request, response, _graphQLParams) => ({
    schema,
    rootValue: root,
    graphiql: true,
    context: {
        req: request,
        res: response,
    },
})));
export default adminApp;

