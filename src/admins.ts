import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import {GraphQLObjectType, GraphQLSchema} from 'graphql';
const adminApp = express();

const UsersQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
        
    }
});

const schema = new GraphQLSchema({query: });

adminApp.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));
export default adminApp;

