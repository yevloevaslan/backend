const {MONGO_DB_NAME, MONGO_DB_PORT, MONGO_DB_URI, PORT, JWT_KEY, ADMIN_PORT, JWT_KEY_GRAPHQL, AWS_ENDPOINT, AWS_BUCKET_NAME, SMS_SERVICE_URI, SMS_API_ID, EMAIL_URL, SMTP1_USER, SMTP1_PASS, SMTP1_HOST, SMTP2_USER, SMTP2_PASS, SMTP2_HOST, SMTP3_USER, SMTP3_PASS, SMTP3_HOST } = process.env;
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
    smsServiceUri: SMS_SERVICE_URI || 'http://usecase.sms.ru/sms/send',
    smsApiID: SMS_API_ID,
    email: {
        url: EMAIL_URL,
    },
    smtp1: {
        sender: 'Samott <postmaster@samott.use-case.ru>',
        host: SMTP1_HOST || 'smtp.eu.mailgun.org',
        user: SMTP1_USER,
        pass: SMTP1_PASS,
    },
    smtp2: {
        sender: 'Samott <postmaster@sa-mott.use-case.ru>',
        host: SMTP2_HOST ||'smtp.eu.mailgun.org',
        user: SMTP2_USER,
        pass: SMTP2_PASS,
    },
    smtp3: {
        sender: 'Samott <postmaster@sa.mott.use-case.ru>',
        host: SMTP3_HOST ||'smtp.eu.mailgun.org',
        user: SMTP3_USER,
        pass: SMTP3_PASS,
    },
};