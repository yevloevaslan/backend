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

export type AboutAuthorInput = {
  description: Scalars['String'];
  photos: Array<Maybe<Scalars['String']>>;
};

export type AboutProjectInput = {
  description: Scalars['String'];
  photos: Array<Maybe<Scalars['String']>>;
};

export type AboutProjectResult = {
  __typename?: 'AboutProjectResult';
  project?: Maybe<AboutProjectBlock>;
  author?: Maybe<AboutProjectBlock>;
  banner?: Maybe<Scalars['String']>;
};

export type FindWordResult = {
  __typename?: 'FindWordResult';
  data?: Maybe<Array<Maybe<IDictionary>>>;
  meta?: Maybe<WordResultMeta>;
};

export type GrammarData = {
  __typename?: 'GrammarData';
  filename?: Maybe<Scalars['String']>;
};

export type GrammarDataResult = {
  __typename?: 'GrammarDataResult';
  data?: Maybe<GrammarData>;
};

export type IDictionary = {
  __typename?: 'IDictionary';
  _id?: Maybe<Scalars['String']>;
  rus?: Maybe<Scalars['String']>;
  ing?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateUser?: Maybe<Scalars['Boolean']>;
  createTask?: Maybe<Scalars['Boolean']>;
  updateTask?: Maybe<Scalars['Boolean']>;
  deleteTask?: Maybe<Scalars['Boolean']>;
  updateAboutProject?: Maybe<Scalars['Boolean']>;
  createWord?: Maybe<Scalars['Boolean']>;
  updateWord?: Maybe<Scalars['Boolean']>;
  deleteWord?: Maybe<Scalars['Boolean']>;
  editGrammar?: Maybe<Scalars['Boolean']>;
};


export type MutationUpdateUserArgs = {
  _id?: Maybe<Scalars['String']>;
  data: UpdateUserData;
};


export type MutationCreateTaskArgs = {
  taskData: TaskCreateData;
};


export type MutationUpdateTaskArgs = {
  _id: Scalars['String'];
  taskData: TaskUpdateData;
};


export type MutationDeleteTaskArgs = {
  _id: Scalars['String'];
};


export type MutationUpdateAboutProjectArgs = {
  aboutProject?: Maybe<AboutProjectInput>;
  aboutAuthor?: Maybe<AboutAuthorInput>;
  banner?: Maybe<Scalars['String']>;
};


export type MutationCreateWordArgs = {
  wordData: WordCreateData;
};


export type MutationUpdateWordArgs = {
  wordData: WordUpdateData;
};


export type MutationDeleteWordArgs = {
  _id: Scalars['String'];
};


export type MutationEditGrammarArgs = {
  filename: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  users?: Maybe<Array<Maybe<User>>>;
  usersCount?: Maybe<Scalars['Int']>;
  tasks?: Maybe<TaskListResult>;
  aboutProject?: Maybe<AboutProjectResult>;
  word?: Maybe<FindWordResult>;
  grammar?: Maybe<GrammarDataResult>;
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


export type QueryWordArgs = {
  query?: Maybe<WordQuery>;
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
  active: Scalars['Boolean'];
  number?: Maybe<Scalars['Int']>;
};

export type TaskCreateData = {
  title: Scalars['String'];
  description: Scalars['String'];
  type: Scalars['String'];
  level: Scalars['String'];
  points: Scalars['Int'];
  params: Params;
  active: Scalars['Boolean'];
  number?: Maybe<Scalars['Int']>;
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
  active?: Maybe<Scalars['Boolean']>;
  number?: Maybe<Scalars['Int']>;
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

export type WordCreateData = {
  rus: Scalars['String'];
  ing: Scalars['String'];
  ingDescription?: Maybe<Scalars['String']>;
  rusDescription?: Maybe<Scalars['String']>;
};

export type WordQuery = {
  _id?: Maybe<Scalars['String']>;
  rus?: Maybe<Scalars['String']>;
  ing?: Maybe<Scalars['String']>;
  ingDescription?: Maybe<Scalars['String']>;
  rusDescription?: Maybe<Scalars['String']>;
};

export type WordResultMeta = {
  __typename?: 'WordResultMeta';
  count?: Maybe<Scalars['Int']>;
};

export type WordUpdateData = {
  _id: Scalars['String'];
  rus?: Maybe<Scalars['String']>;
  ing?: Maybe<Scalars['String']>;
};

export type AboutProjectBlock = {
  __typename?: 'aboutProjectBlock';
  photos?: Maybe<Array<Maybe<Scalars['String']>>>;
  description?: Maybe<Scalars['String']>;
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
  answer?: Maybe<Scalars['String']>;
  answerArray?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ParamsType = {
  __typename?: 'paramsType';
  answers?: Maybe<Array<Maybe<Scalars['String']>>>;
  photos?: Maybe<Array<Maybe<Scalars['String']>>>;
  sound?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  answer?: Maybe<Scalars['String']>;
  answerArray?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export enum Sex {
  F = 'f',
  M = 'm'
}
