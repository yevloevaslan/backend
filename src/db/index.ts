import mongoose from 'mongoose';
import config from '../config';
const {port, uri, dbName} = config.mongoDB;

export default function (): Promise<typeof mongoose> {
    mongoose.Promise = global.Promise;
    mongoose.set('useCreateIndex', true);
    return mongoose.connect(`mongodb://${uri}:${port}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true});
}