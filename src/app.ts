import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { notFound } from 'boom';
const app = express();
const {NODE_ENV} = process.env;
import routes from './routes';
import cookieParser from 'cookie-parser';

if (NODE_ENV !== 'production') {
    app.use((req: Request, _res: Response, next: NextFunction) => {
        console.log(`${new Date()} ${req.ip}:${req.method} ${req.url}`);
        next();
    });
}
app.use(cors({
    origin: true,
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: ['Content-Type', 'x-access-token'],
    optionsSuccessStatus: 200,
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/ready', (_req, res) => res.send());
app.use('/api', routes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
    return next(notFound('Not found'));
});

app.use((error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(new Date(), error);
    res.status(error.output ? error.output.statusCode || 500 : 500).send({
        error: error.output ? error.output.payload.message : 'Server error',
        data: null,
    });
});

export default app;