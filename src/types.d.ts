export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateUser?: Maybe<Scalars['Boolean']>;
  createTask?: Maybe<Scalars['Boolean']>;
  updateTask?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateUserArgs = {
  id?: Maybe<Scalars['String']>;
  data?: Maybe<UpdateUserData>;
};


export type MutationCreateTaskArgs = {
  taskData?: Maybe<TaskCreateData>;
};


export type MutationUpdateTaskArgs = {
  taskData?: Maybe<TaskUpdateData>;
};

export type Query = {
  __typename?: 'Query';
  users?: Maybe<Array<Maybe<User>>>;
  usersCount?: Maybe<Scalars['Int']>;
  tasks?: Maybe<TaskListResult>;
};


export type QueryUsersArgs = {
  _id?: Maybe<Scalars['String']>;
  pagination?: Maybe<PaginationParams>;
};


export type QueryTasksArgs = {
  type: Scalars['String'];
  query?: Maybe<TasksQuery>;
  pagination?: Maybe<PaginationParams>;
};

export type Task = {
  __typename?: 'Task';
  _id?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  description: Scalars['String'];
  type: Scalars['String'];
  level: Scalars['String'];
  points: Scalars['Int'];
  params?: Maybe<ParamsType>;
};

export type TaskCreateData = {
  title: Scalars['String'];
  description: Scalars['String'];
  type: Scalars['String'];
  level: Scalars['String'];
  points: Scalars['Int'];
  params: Params;
};

export type TaskListResult = {
  __typename?: 'TaskListResult';
  list?: Maybe<Array<Maybe<Task>>>;
  meta?: Maybe<TaskListResultMeta>;
};

export type TaskListResultMeta = {
  __typename?: 'TaskListResultMeta';
  count?: Maybe<Scalars['Int']>;
};

export type TaskUpdateData = {
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['String']>;
  points?: Maybe<Scalars['Int']>;
  params?: Maybe<Params>;
};

export type TasksQuery = {
  _id?: Maybe<Scalars['String']>;
};

export type UpdateUserData = {
  phone?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['String']>;
  sex?: Maybe<Sex>;
  email?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  phone?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  middleName?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Int']>;
  birthday?: Maybe<Scalars['String']>;
  sex?: Maybe<Sex>;
  email?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type PaginationParams = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

export type Params = {
  answers?: Maybe<Array<Maybe<Scalars['String']>>>;
  photos?: Maybe<Array<Maybe<Scalars['String']>>>;
  sound?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  answer: Scalars['String'];
};

export type ParamsType = {
  __typename?: 'paramsType';
  answers?: Maybe<Array<Maybe<Scalars['String']>>>;
  photos?: Maybe<Array<Maybe<Scalars['String']>>>;
  sound?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  answer: Scalars['String'];
};

export enum Sex {
  F = 'f',
  M = 'm'
}