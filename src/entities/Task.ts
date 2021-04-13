export interface ITask<T> {
    _id: string,
    title: string,
    description: string,
    type: string,
    level: string,
    points: number,
    params: T,
}

export interface TaskOne {
    photos: [string],
    text: string,
    answer: string,
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

export type TaskParams = TaskOne | TaskTwo | TaskThree | TaskFour | TaskFive;
