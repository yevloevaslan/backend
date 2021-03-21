import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import {UserModel} from '../db/models';
import moment from 'moment';
import { IUser } from '../entities';
import { paginationParams } from '../libs/checkInputParameters';

type UserResolveResult = Array<IUser>;

const userResolve = async ({_id}: {_id: string}, options: {page?: number, limit?: number} = {}): Promise<UserResolveResult> => {
    const query: {_id?: string} = {};
    if (_id) query._id = _id;
    const {skip, limit} = paginationParams(options.page, options.limit);
    const users = await UserModel.find(query).lean().limit(limit).skip(skip);
    return users.map(u => {
        u.createdAt = moment(u.createdAt).toISOString();
        u.updatedAt = moment(u.updatedAt).toISOString();
        return u;
    });
};

const UserGraphQLType = new GraphQLObjectType({
    name: 'user',
    fields: {
        _id: {type: GraphQLString},
        phone: {type: GraphQLString},
        createdAt: {type: GraphQLString},
        updatedAt: {type: GraphQLString},
    },
});

const UserQuery = {
    type: GraphQLList(UserGraphQLType),
    args: {
        _id: {type: GraphQLString},
        limit: {type: GraphQLInt},
        page: {type: GraphQLInt},
    },
    resolve: async (_, args: {_id: string, page: number, limit: number}): Promise<UserResolveResult> => {
        const users = await userResolve({_id: args._id}, {page: args.page, limit: args.limit});
        return users;
    },
};

const UserCountQuery = {
    type: GraphQLInt,
    resolve: async (): Promise<number> => {
        return UserModel.countDocuments();
    },
};

export {
    UserQuery,
    UserCountQuery,
};