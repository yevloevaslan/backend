import { badRequest, notFound } from 'boom';
import { AdminModel, ConfirmCodeModel, UserModel } from '../../db/models';
import AdminClass from './AdminClass';
import ConfirmCodeClass from './ConfirmCodeClass';
import { TaskModel } from '../../db/models/Task';
import { ITask, TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import UserClass from './UserClass';
import TaskOneClass from './TaskOneClass';
import TaskTwoClass from './TaskTwoClass';
import TaskThreeClass from './TaskThreeClass';
import TaskFourClass from './TaskFourClass';
import TaskFiveClass from './TaskFiveClass';
import { Document } from 'mongoose';

export const User = async (data: { email?: string, _id?: string, }): Promise<UserClass> => {
    const query = data._id ? { _id: data._id } : { email: data.email };
    let userData = await UserModel.findOne(query);
    if (!userData) {
        if (query.email) {
            userData = await new UserModel({
                email: data.email,
                score: 0,
                firstIn: true,
            }).save();
        }
        if (!userData) throw notFound('User not found');
    }
    const user = new UserClass(userData);
    return user;
};

export const ConfirmCode = async (data: { email?: string, _id?: string }): Promise<ConfirmCodeClass> => {
    const query = data._id ? { _id: data._id } : { email: data.email };
    let confirmCodeData = await ConfirmCodeModel.findOne(query);
    if (!confirmCodeData) {
        if (data.email) {
            confirmCodeData = await new ConfirmCodeModel({
                email: data.email,
            }).save();
        }
    }
    const confirmCode = new ConfirmCodeClass(confirmCodeData);
    return confirmCode;
};

export const Admin = async (query: { _id?: string, login?: string }): Promise<AdminClass> => {
    const admin = await AdminModel.findOne(query);
    if (!admin) throw notFound('Admin not found');
    return new AdminClass(admin);
};

export const TaskFactory = async (data?: taskDataInterface<TaskParams>, _id?: string): Promise<TaskClassInterface> => {
    if (!data && !_id) throw badRequest('Введите данные');
    let task: ITask<TaskParams>&Document;
    if (_id) {
        task = await TaskModel.findById(_id);
        if (!task) throw notFound('Задание не найдено');
    }
    const taskClass = taskTypeSwitch(task ? task.type : data.type, task);
    if (!_id) await taskClass.createTask(data);
    return taskClass;
};

const taskTypeSwitch = (type, task?: ITask<TaskParams>&Document) => {
    let taskClass: TaskClassInterface;
    switch (String(type)) {
    case '1': {
        taskClass = task ? new TaskOneClass(task) : new TaskOneClass();
        break;
    }
    case '2': {
        taskClass = task ? new TaskTwoClass(task) : new TaskTwoClass();
        break;
    }
    case '3': {
        taskClass = task ? new TaskThreeClass(task) : new TaskThreeClass();
        break;
    }
    case '4': {
        taskClass = task ? new TaskFourClass(task) : new TaskFourClass();
        break;
    }
    case '5': {
        taskClass = task ? new TaskFiveClass(task) : new TaskFiveClass();
        break;
    }
    }
    return taskClass;
};


