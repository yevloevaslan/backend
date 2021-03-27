import { buildSchema } from 'graphql';
import { login } from '../controllers/AdminController';
import { getUsers } from '../controllers/UserController';
import { IUser } from '../entities';
type UserResolveResult = Array<IUser>;

export const schema = buildSchema(`
    type Query {
        users(_id: String, limit: Int, page: Int): [User] 
    }

    type Mutation {
        login(login: String!, password: String!): TokenResult
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
    login: async (args: {login: string, password: string}): Promise<{token: string}> => {
        const {data} = await login({login: args.login, password: args.password});
        return {
            token: data.token,
        };
    },
    users: async (args: {_id: string, limit: number, page: number}): Promise<UserResolveResult> => {
        const {data: {users}} = await getUsers({_id: args._id}, {page: args.page, limit: args.limit});
        return users;
    },
};