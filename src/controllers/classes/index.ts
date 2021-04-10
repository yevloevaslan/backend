import { notFound } from 'boom';
import { AdminModel, ConfirmCodeModel, UserModel } from '../../db/models';
import AdminClass from './AdminClass';
import ConfirmCodeClass from './ConfirmCodeClass';
import TaskOneClass from './TaskOneClass';
import TaskTwoClass from './TaskOneClass';
import TaskThreeClass from './TaskOneClass';
import TaskFourClass from './TaskOneClass';
import TaskFiveClass from './TaskOneClass';
import { TaskModel } from '../../db/models/Task';
import { TaskParams } from '../../entities/Task';
import { taskDataInterface } from '../interfaces';
import { TaskClassInterface } from '../interfaces/Task';
import UserClass from './UserClass';

export const User = async (data: { phone?: string, _id?: string }): Promise<UserClass> => {
  const query = data._id ? { _id: data._id } : { phone: data.phone };
  let userData = await UserModel.findOne(query);
  if (!userData) {
    if (query.phone) {
      userData = await new UserModel({
        phone: data.phone,
        score: 0,
        firstIn: true,
      }).save();
    }
    if (!userData) throw notFound('User not found');
  }
  const user = new UserClass(userData);
  return user;
};

export const ConfirmCode = async (data: { phone?: string, _id?: string }): Promise<ConfirmCodeClass> => {
  const query = data._id ? { _id: data._id } : { phone: data.phone };
  let confirmCodeData = await ConfirmCodeModel.findOne(query);
  if (!confirmCodeData) {
    if (data.phone) {
      confirmCodeData = await new ConfirmCodeModel({
        phone: data.phone,
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
  let taskClass: TaskClassInterface;
  if (_id) {
    const task = await TaskModel.findById(_id);
    switch (task.type) {
      case '1': taskClass = new TaskOneClass(task); break;
    }

  }
  switch (data.type) {
    case '1': {
      taskClass = new TaskOneClass();
      await taskClass.createTask(data);
      break;
    }
    case '2': {
      taskClass = new TaskTwoClass();
      await taskClass.createTask(data);
      break;
    }
    case '3': {
      taskClass = new TaskThreeClass();
      await taskClass.createTask(data);
      break;
    }
    case '4': {
      taskClass = new TaskFourClass();
      await taskClass.createTask(data);
      break;
    }
    case '5': {
      taskClass = new TaskFiveClass();
      await taskClass.createTask(data);
      break;
    }
  }
  return taskClass;
};


