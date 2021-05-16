import S3 from 'aws-sdk/clients/s3';
import config from '../config';
const {awsBucketName, awsEndpoint} = config;
import multer, { Multer } from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import {badRequest} from 'boom';

const s3 = new S3({
    endpoint: awsEndpoint,
});

export const upload = (): Multer => {
    return multer({
        limits: {fileSize: 20 * 1024 * 1024},
        storage: multerS3({
            s3: s3,
            bucket: awsBucketName,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: (_req, file, cb) => {
                cb(null, {fieldName: file.fieldname});
            },
            key: (_req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();

                const filename = `${file.fieldname}-${Date.now()}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (_req, file, next) => {
            if (!file) return next(badRequest('File is missing'));
            return next(null, true);
        },
    });
};

export const deleteObject = (name: string): Promise<S3.DeleteObjectOutput> => new Promise((resolve, reject) => {
    const params = {
        Bucket: awsBucketName,
        Key: name,
    };
    s3.deleteObject(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
    });
});