export interface IUser {
    _id: string,
    phone: string,
    score: number,
    firstIn: boolean,
    birthday: string,
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    sex: 'm' | 'f',
    createdAt: string,
    updatedAt: string,
}