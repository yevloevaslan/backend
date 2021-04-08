import { Schema, Document, model } from 'mongoose';
import { ITask, TaskParams } from '../../entities/Task';

export interface ITaskModel<T> extends ITask<T>, Document {
    _id: string
    title: string,
    description: string,
    type: string,
    level: string,
    points: string,
    params: T,
}

export const Task = new Schema({
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

export const TaskModel = model<ITaskModel<TaskParams>>('task', Task);
