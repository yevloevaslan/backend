import { Schema, Document, model } from 'mongoose';
import { ITask, TaskParams } from '../../entities/Task';

export const Task = new Schema({
    type: {
        type: String,
        required: true,
    },
    level: {
        enum: [
            '1',
            '2',
            '3',
        ],
        type: String,
        required: true,
        index: true,
    },
    points: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    params: {
        type: Object,
    },
    number: {
        type: Number,
    },
}, {
    timestamps: true,
    strict: false,
});

export const TaskModel = model<ITask<TaskParams>&Document>('task', Task);
