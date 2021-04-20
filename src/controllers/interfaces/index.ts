export interface userUpdateInterface {
    firstName?: string,
    lastName?: string,
    birthday?: string,
    middleName?: string,
    email?: string,
    sex?: 'f' | 'm',
}

export interface taskDataInterface<T> {
    title: string,
    description: string,
    type: string,
    level: string,
    points: number,
    params: T,
    active: boolean,
}