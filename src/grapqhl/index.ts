import express from 'express';
import {graphqlHTTP} from 'express-graphql';
// import {GraphQLObjectType, GraphQLSchema} from 'graphql';
// import {UserCountQuery, UserQuery} from './grapqhl/queries.ts/users';
const adminApp = express();
import db from '../db';
db();
import {schema, root} from './schema';
import cookieParser from 'cookie-parser';
// import { checkTokenMiddleware } from '../routes/middlewares/auth.middleware';
import { apiErrorHandler } from '../libs/errorHandler';
import {login} from '../controllers/AdminController';

adminApp.use(express.json({ limit: '1mb' }));
adminApp.use(cookieParser());

adminApp.post('/api/admin/login', async (req, res, next) => {
    try {
        const {password} = req.body;
        const {data} = await login({login: req.body.login, password});
        res.cookie('x-access-token', data.token);
        res.send({
            data: null,
        });
    } catch (err) {
        next(err);
    }
});

adminApp.use('/api/admin', graphqlHTTP((request, response, _graphQLParams) => ({
    schema,
    rootValue: root,
    graphiql: true,
    context: {
        req: request,
        res: response,
    },
})));

adminApp.use(apiErrorHandler);

export default adminApp;

