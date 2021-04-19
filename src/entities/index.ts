export interface IConfirmCode{
    _id: string,
    phone: string,
    code: string,
    updatedAt: string,
}
export interface IUser {
    _id: string,
    phone: string,
    createdAt: string,
    updatedAt: string,
}
export interface IAdmin {
    _id: string,
    login: string,
    createdAt: string,
    updatedAt: string,
    password?: string,
}