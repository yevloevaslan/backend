import { Schema, Document, model } from 'mongoose';
import { ITask, TaskParams } from '../../entities/Task';

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
    },
    level: {
        enum: [
            '1',
            '2',
            '3',
        ],
        type: String,
        required: true,
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
}, {
    timestamps: true,
    strict: false,
});

export const TaskModel = model<ITask<TaskParams>&Document>('task', Task);
