export interface ITask<T> {
  _id: string,
  title: string,
  description: string,
  type: string,
  level: string,
  points: string,
  params: T,
}

export interface TaskOne {
  photos: [string],
  text: string,
<<<<<<< HEAD
  answer: string,
=======
  answer: string, // Ответ следует хранить внутри параметров у каждого задания так как у них могут появиться ответы с выбором двух вариантов ответа
>>>>>>> 5b390ab475507ed82dcd6120d87eca97613d808a
}

export interface TaskTwo {
  text: string,
  answers: [string],
  answer: string,
}

export interface TaskThree {
  sound: string,
  answers: [string],
  answer: string,
}

export interface TaskFour {
  sound: string,
  answer: string,
}

export interface TaskFive {
  text: string,
  answers: [string],
  answer: string,
}

<<<<<<< HEAD
export type TaskParams = TaskOne | TaskTwo | TaskThree | TaskFour | TaskFive;
=======
export type TaskParams = TaskOne | TaskTwo | TaskThree | TaskFour | TaskFive;
>>>>>>> 5b390ab475507ed82dcd6120d87eca97613d808a
