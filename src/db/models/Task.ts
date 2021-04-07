import { Schema, model, Document } from 'mongoose';
import { Task, TaskOne, TaskTwo, TaskThree, TaskFour, TaskFive } from '../../entities/Task';

export interface TaskModel extends Task, Document {
  title: string,
  description: string,
  type: string,
  level: string,
  points: string,
  params: TaskOne | TaskTwo | TaskThree | TaskFour | TaskFive,
}

const Task = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: String,
    required: true,
    unique: true,
  },
  points: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
  strict: false,
});

export const TaskModel = model<TaskModel>('task', Task);
