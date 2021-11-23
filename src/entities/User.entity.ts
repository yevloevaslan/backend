import {GroupByLevel} from './TasksCount.entity';
export interface IUser {
    _id: string,
    phone: string,
    score: number,
    rating: number,
    firstIn: boolean,
    birthday: string,
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    sex: 'm' | 'f' | null,
    createdAt: string,
    updatedAt: string,
    img: string,
    tasksCount: {
        byLevel: GroupByLevel
    }
}
