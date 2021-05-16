const {MONGO_DB_NAME, MONGO_DB_PORT, MONGO_DB_URI, PORT, JWT_KEY, ADMIN_PORT, JWT_KEY_GRAPHQL, AWS_ENDPOINT, AWS_BUCKET_NAME} = process.env;

export default {
    mongoDB: {
        uri: MONGO_DB_URI || 'localhost',
        port: MONGO_DB_PORT || 27017,
        dbName: MONGO_DB_NAME || 'translate',
    },
    port: PORT || 8888,
    adminPort: ADMIN_PORT || 8887,
    jwtKeyGraphql: JWT_KEY_GRAPHQL || 'translate-graphql',
    jwtKey: JWT_KEY || 'translate',
    awsBucketName: AWS_BUCKET_NAME || 'mus-backet',
    awsEndpoint: AWS_ENDPOINT || 'fra1.digitaloceanspaces.com',
};