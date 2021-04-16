import { buildSchema } from 'graphql';
import { getUsers, usersCount } from '../controllers/UserController';
import { UpdateUserData, User } from '../types';

type UserResolveResult = Array<User>;

export const schema = buildSchema(`
    type Query {
        users(_id: String, limit: Int, page: Int): [User],
        usersCount: Int
    }

    type Mutation {
        updateUser(data: UpdateUserData): Boolean
    }

    input UpdateUserData {
        phone: String,
        firstName: String,
        lastName: String,
        middleName: String,
        birthday: String,
        sex: String,
        email: String,
    }

    type User {
        _id: ID,
        phone: String,
        firstName: String,
        lastName: String,
        middleName: String,
        score: Int,
        birthday: String,
        sex: String,
        email: String,
        createdAt: String,
        updatedAt: String
    }
`);

export const root = {
    usersCount: async (): Promise<number> => {
        const {data: {count}} = await usersCount();
        return count;
    },
    users: async (args: {_id: string, limit: number, page: number}): Promise<UserResolveResult> => {
        const {data: {users}} = await getUsers({_id: args._id}, {page: args.page, limit: args.limit});
        return users;
    },
    updateUser: async (args: {data: UpdateUserData}): Promise<boolean> => {
        console.log(args.data);
        return true;
    },
};
