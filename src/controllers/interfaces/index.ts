export interface userUpdateInterface {
    firstName?: string,
    lastName?: string,
    birthday?: string,
    middleName?: string,
    email?: string,
    sex?: 'f' | 'm' | '' | null,
    img?: string,
}

export interface taskDataInterface<T> {
    type: string,
    level: string,
    points: number,
    params: T,
    active: boolean,
    number?: number
}