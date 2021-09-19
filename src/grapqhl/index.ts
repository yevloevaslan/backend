import express from 'express';
import {graphqlHTTP} from 'express-graphql';
const adminApp = express();
import db from '../db';
db();
import {schema, root} from './schema';
import cookieParser from 'cookie-parser';
import { apiErrorHandler } from '../libs/errorHandler';
import {login} from '../controllers/AdminController';
import Boom from 'boom';
import { badRequest } from 'boom';
import { createFile } from '../controllers/FileController';
import { upload } from '../libs/upload';
const NODE_ENV = process.env.NODE_ENV;

adminApp.use(express.json({ limit: '50mb' }));
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

adminApp.post('/api/admin/upload',
    async (req, res, next) => {
        try {
            upload().single('file')(req, res, next);
        } catch (err) {
            next(err);
        }
    }, async (req, res, next) => {
        try {
            if (!req.file) {
                throw badRequest('File is missing');
            }
            console.log(req.file);
            const { key } = req.file as unknown as Record<'location'|'key', string>;
            let {location: path} = req.file as unknown as Record<'location'|'key', string>;
            const prefix = 'https://';
            if (path.substr(0, prefix.length) !== prefix) {
                path = prefix + path;
            }
            res.send({
                data: {
                    path,
                },
            });
            createFile({path, key});
        } catch (err) {
            next(err);
        }
    });

adminApp.use('/api/admin', graphqlHTTP((request, response, _graphQLParams) => ({
    schema,
    rootValue: root,
    graphiql: true,
    customFormatErrorFn: (err) => {
        if (NODE_ENV !== 'production') console.error(err);
        const originalError = err.originalError as Boom;
        return ({ message: err.message, statusCode: originalError?.output?.statusCode });
    },
    context: {
        req: request,
        res: response,
    },
})));

adminApp.use(apiErrorHandler);

export default adminApp;

