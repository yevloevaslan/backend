import { Request } from 'express';
//import {TaskFactory} from '../../controllers/classes/index';
import TaskFiveClass from '../../controllers/classes/TaskFiveClass';
import TaskFourClass from '../../controllers/classes/TaskFourClass';
import TaskOneClass from '../../controllers/classes/TaskOneClass';
import TaskThreeClass from '../../controllers/classes/TaskThreeClass';
import TaskTwoClass from '../../controllers/classes/TaskTwoClass';

//const task = TaskFactory();

export interface TaskOneRequestInterface extends Request {
    task?: TaskOneClass,
}

export interface TaskTwoRequestInterface extends Request {
    task?: TaskTwoClass,
}

export interface TaskThreeRequestInterface extends Request {
    task?: TaskThreeClass,
}

export interface TaskFourRequestInterface extends Request {
    task?: TaskFourClass,
}

export interface TaskFiveRequestInterface extends Request {
    task?: TaskFiveClass,
}

export interface TaskRequestInterface extends Request {
    task?: TaskOneClass | TaskTwoClass | TaskThreeClass | TaskFourClass | TaskFiveClass,
}
