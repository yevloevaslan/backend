import { getNextTaskNumber } from '../controllers/TaskControllers';
import { TaskModel } from '../db/models/Task';
import db from '../db';
db();
(async () => {
    try {
        const tasks = await TaskModel.find();
        for (const task of tasks) {
            if (!task.number) {
                task.number = await getNextTaskNumber(task);
                await task.save();
            }
        }
    } catch (err) {
        console.error(err);
    }
})();