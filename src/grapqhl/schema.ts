import { buildSchema } from 'graphql';
import { createOrUpdateInformationAboutProject, getInformationAboutProject } from '../controllers/AboutProject.Controller';
import { createTask, deleteTask, getTasks, TaskResultData, TaskResultMeta, updateTask } from '../controllers/TaskControllers';
import { getUsers, updateUserData, usersCount } from '../controllers/UserController';
import { TaskParams } from '../entities/Task';
import { UpdateUserData, User, TaskCreateData, PaginationParams, TasksQuery, TaskUpdateData, AboutProjectResult, AboutAuthorInput, AboutProjectInput, FindWordResult, WordCreateData, WordUpdateData, WordQuery, GrammarDataResult } from '../types';
import { findWord, createWord, updateWord, deleteWord } from '../controllers/DictionaryController';
import { editGrammarFile, getGrammarFile } from '../controllers/GrammarController';
type UserResolveResult = Array<User>;

export const schema = buildSchema(`
type Query {
    users(_id: String, pagination: paginationParams): [User],
    usersCount: Int,
    tasks(type: String!, query: TasksQuery, pagination: paginationParams): TaskListResult,
    aboutProject: AboutProjectResult,
    word(query: WordQuery,  pagination: paginationParams): FindWordResult
    grammar: GrammarDataResult
}

type Mutation {
    updateUser(_id: String, data: UpdateUserData!): Boolean,
    createTask(taskData: TaskCreateData!): Boolean,
    updateTask(_id: String!, taskData: TaskUpdateData!): Boolean
    deleteTask(_id: String!): Boolean
    updateAboutProject(aboutProject: AboutProjectInput, aboutAuthor: AboutAuthorInput): Boolean
    createWord(wordData: WordCreateData!): Boolean
    updateWord(wordData: WordUpdateData!): Boolean
    deleteWord(_id: String!): Boolean
    editGrammar(filename: String!): Boolean
}

input TasksQuery {
    _id: String
}

input AboutProjectInput {
    description: String!,
    photos: [String]!
}

input AboutAuthorInput {
    description: String!,
    photos: [String]!
}

input paginationParams {
    limit: Int,
    page: Int
}

input TaskUpdateData {
    title: String,
    description: String,
    level: String,
    points: Int,
    params: params,
    active: Boolean
}

input TaskCreateData {
    title: String!,
    description: String!,
    type: String!,
    level: String!,
    points: Int!,
    params: params!,
    active: Boolean!
}

input params {
    answers: [String],
    photos: [String],
    sound: String,
    text: String,
    answer: String!
}

input UpdateUserData {
    phone: String,
    firstName: String,
    lastName: String,
    middleName: String,
    birthday: String,
    sex: sex,
    email: String,
}


input WordQuery {
    _id: String
    rus: String
    ing: String
}

input WordCreateData {
    rus: String!,
    ing: String!,
}

input WordUpdateData {
    _id: String!
    rus: String,
    ing: String,
}


type AboutProjectResult {
    project: aboutProjectBlock
    author: aboutProjectBlock
}

type aboutProjectBlock {
    photos: [String],
    description: String,
}

type TaskListResult {
    list: [Task],
    meta: TaskListResultMeta
}

type TaskListResultMeta {
    count: Int
}

type Task {
    _id: ID,
    title: String!,
    description: String!,
    type: String!,
    level: String!,
    points: Int!,
    params: paramsType,
    active: Boolean!
}

type paramsType {
    answers: [String],
    photos: [String],
    sound: String,
    text: String,
    answer: String!
}

type User {
    _id: ID,
    phone: String,
    firstName: String,
    lastName: String,
    middleName: String,
    score: Int,
    birthday: String,
    sex: sex,
    email: String,
    createdAt: String,
    updatedAt: String
}

type IDictionary {
        _id: String,
        rus: String,
        ing: String,
}
type FindWordResult {
  data: [IDictionary]
  meta: WordResultMeta
}
type WordResultMeta {
    count: Int
}
type GrammarDataResult{
    data: GrammarData
}
type GrammarData {
    filename: String
}

enum sex {
    f
    m
}
`);

export const root = {
    usersCount: async (): Promise<number> => {
        const { data: { count } } = await usersCount();
        return count;
    },
    users: async (args: { _id: string, pagination: PaginationParams }): Promise<UserResolveResult> => {
        const { data: { users } } = await getUsers({ _id: args._id }, { page: args.pagination.page, limit: args.pagination.limit });
        return users;
    },
    aboutProject: async (): Promise<AboutProjectResult> => {
        const { data: aboutProject } = await getInformationAboutProject();
        return aboutProject;
    },
    updateAboutProject: async (args: { aboutProject: AboutProjectInput, aboutAuthor: AboutAuthorInput }): Promise<boolean> => {
        await createOrUpdateInformationAboutProject({ author: args.aboutAuthor, project: args.aboutProject });
        return true;
    },
    updateUser: async (args: { id: string, data: UpdateUserData }): Promise<boolean> => {
        await updateUserData(undefined, args.data, args.id);
        return true;
    },
    createTask: async (args: { taskData: TaskCreateData }): Promise<boolean> => {
        const taskData = args.taskData;
        await createTask({
            points: taskData.points,
            description: taskData.description,
            level: taskData.level,
            title: taskData.title,
            type: taskData.type,
            params: taskData.params as TaskParams,
            active: taskData.active,
        });
        return true;
    },

    tasks: async (args: { pagination: PaginationParams, type: string, query: TasksQuery }): Promise<{ list: Array<TaskResultData>, meta: TaskResultMeta }> => {
        const result = await getTasks({ type: args.type, _id: args.query?._id }, { page: args.pagination?.page, limit: args.pagination?.limit });
        return {
            list: result.data.tasks,
            meta: result.meta,
        };
    },
    updateTask: async (args: { _id: string, taskData: TaskUpdateData }): Promise<boolean> => {
        const taskData = args.taskData;
        await updateTask(args._id, {
            points: taskData.points,
            description: taskData.description,
            level: taskData.level,
            title: taskData.title,
            params: taskData.params as TaskParams,
            active: taskData.active,
        });
        return true;
    },
    deleteTask: async (args: { _id: string }): Promise<boolean> => {
        await deleteTask(args._id);
        return true;
    },
    word: async (args: { query?: WordQuery, pagination?: PaginationParams}): Promise<FindWordResult> => {
        const result = await findWord(args.query, { page: args.pagination?.page, limit: args.pagination?.limit });       
        return {
            data: result.data,
            meta: result.meta,
        };
    },
    createWord: async (args: { wordData: WordCreateData }): Promise<boolean> => {
        const wordData = args.wordData;
        await createWord({
            rus: wordData.rus,
            ing: wordData.ing,
        });
        return true;
    },
    updateWord: async (args: { wordData: WordUpdateData }): Promise<boolean> => {
        const wordData = args.wordData;
        await updateWord({
            _id: wordData._id,
            rus: wordData.rus,
            ing: wordData.ing,
        });
        return true;
    },
    deleteWord: async (args: { _id: string }): Promise<boolean> => {
        await deleteWord({ _id: args._id });
        return true;
    },
    editGrammar: async (args: {filename: string }): Promise<boolean> => {
        await editGrammarFile(args.filename);
        return true;
    },
    grammar: async (): Promise<GrammarDataResult> => {
        const result = await getGrammarFile();
        return {
            data: result.data
        };
    },
};
