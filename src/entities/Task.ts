export interface Task {
  title: string,
  description: string,
  type: string,
  level: string,
  points: string,
  params: TaskOne | TaskTwo | TaskThree | TaskFour | TaskFive,
}

export interface TaskOne {
  photos: [string],
  answer: string,
}

export interface TaskTwo {
  text: string,
  answers: [string],
}

export interface TaskThree {
  sound: string,
  answers: [string],
}

export interface TaskFour {
  sound: string,
  answer: string,
}

export interface TaskFive {
  text: string,
  answers: [string],
}
