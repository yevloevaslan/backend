const {MONGO_DB_NAME, MONGO_DB_PORT, MONGO_DB_URI, PORT} = process.env;

export default {
    mongoDB: {
        uri: MONGO_DB_URI || 'localhost',
        port: MONGO_DB_PORT || 27017,
        dbName: MONGO_DB_NAME || 'translate',
    },
    port: PORT || 8888,
};