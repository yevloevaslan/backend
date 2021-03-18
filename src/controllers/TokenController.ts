import jwt from 'jsonwebtoken';
import config from '../config';
const {jwtKey} = config;

type DataToken = {_id: string, type: 'user' | 'admin'};

const createToken = async (data: DataToken): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(data, jwtKey, (err: Error|null, token?: string) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(String(token));
        });
    });
};

const decodeToken = async (token: string): Promise<DataToken> => {
    return new Promise((resolve, reject) => {
        return jwt.verify(token, jwtKey, (err, data) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve(data as DataToken);
        });
    });
};
export {
    createToken,
    decodeToken,
};