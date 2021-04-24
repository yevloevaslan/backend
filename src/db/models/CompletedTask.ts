import {Schema, model, Document} from 'mongoose';
import {ICompletedTask} from '../../entities/CompletedTask.entity';

const CompletedTask = new Schema({
    userId: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: true,
    },
    correct: {
        type: Boolean,
    }
});

export const CompletedTaskModel = model<ICompletedTask&Document>('completed_task', CompletedTask);

