import { Response } from 'express';
import { buildSchema } from 'graphql';
import { login } from '../controllers/AdminController';
import { getUsers, usersCount } from '../controllers/UserController';
import { IUser } from '../entities';

type UserResolveResult = Array<IUser>;

export const schema = buildSchema(`
    type Query {
        users(_id: String, limit: Int, page: Int): [User],
        usersCount: Int
    }

    type Mutation {
        login(login: String!, password: String!): TokenResult,
        updateUser(firstName: String): Void
    }

    type TokenResult {
        token: String
    }

    type User {
        _id: ID,
        phone: String,
        createdAt: String,
        updatedAt: String
    }
`);

export const root = {
    login: async (args: {login: string, password: string}, context: {res: Response}): Promise<{token: string}> => {
        const {data} = await login({login: args.login, password: args.password});
        context.res.cookie('x-access-token', data.token);
        return {
            token: data.token,
        };
    },
    usersCount: async (): Promise<number> => {
        const {data: {count}} = await usersCount();
        return count;
    },
    users: async (args: {_id: string, limit: number, page: number}): Promise<UserResolveResult> => {
        const {data: {users}} = await getUsers({_id: args._id}, {page: args.page, limit: args.limit});
        return users;
    },

};
