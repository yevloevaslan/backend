export interface ITask<T> {
    _id: string,
    title: string,
    description: string,
    type: string,
    level: string,
    points: number,
    params: T,
    active: boolean,
}

export interface TaskOne { //задание с изображением
    photos: string[],
    text: string,
    answerArray?: string[],
    answer?: string,
}

export interface TaskTwo { //выбрать правильный перевод
    text: string,
    answers: string[],
    answer?: string,
    answerArray?: string[],
}

export interface TaskThree {//аудиозадание
    sound: string,
    answers: string[],
    answer?: string,
    answerArray?: string[],
    
}

export interface TaskFour {//аудиозадание со свободным ответом
    sound: string,
    answer?: string,
    answerArray?: string[],
}

export interface TaskFive {//заполните пропуск
    answers: string[],
    text: string,
    answer?: string,
    answerArray?: string[],
}

export type TaskParams = TaskOne | TaskTwo | TaskThree | TaskFour | TaskFive;
export type MultiAnswerTaskParams = TaskThree;
