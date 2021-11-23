import {Schema, model, Document} from 'mongoose';
import {ITasksCountEntity} from '../../entities/TasksCount.entity';

const TasksCount = new Schema({
    byLevel: {
        type: Object,
    },
});

export const TasksCountModel = model<ITasksCountEntity&Document>('tasksCount', TasksCount);