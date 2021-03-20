import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import {UserModel} from '../db/models';
import moment from 'moment';
import { IUser } from '../entities';

const userResolve = async ({_id}: {_id: string}) => {
    const query: {_id?: string} = {};
    if (_id) query._id = _id;
    const users = await UserModel.find(query).lean();
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
    },
    resolve: async (_, args: {_id: string}): Promise<Array<IUser>> => {
        const users = await userResolve({_id: args._id});
        return users;
    },
};

export default UserQuery;