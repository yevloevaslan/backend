import {schemaErrorHandler} from '../../../libs/joiSchemaValidation';
import {taskParamsSchema} from '../TaskTwoClass';

const updateTask = async function (this, data): Promise<void> {
    if (data.title) this.task.title = data.title;
    if (data.description) this.task.description = data.description;

    if (data.level) this.task.level = data.level;
    if (data.points) this.task.points = data.points;
    if (data.active) this.task.active = data.active;
    if (data.params) {
        schemaErrorHandler(taskParamsSchema.validate(data));
        this.task.params = data.params;
    }
    await this.task.save();
    return;
};

export {
    updateTask,
};