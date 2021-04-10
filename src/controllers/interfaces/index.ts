export interface userUpdateInterface {
    firstName: string,
    lastName: string,
    birthday: string,
    middleName: string,
    email: string,
}

export interface taskDataInterface<T> {
  title: string,
  description: string,
  type: string,
  level: string,
  points: string,
  params: T,
}
