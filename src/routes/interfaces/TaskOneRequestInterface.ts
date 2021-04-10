import { Request } from 'express';
import TaskOneClass from '../../controllers/classes/TaskOneClass';

export interface TaskOneRequestInterface extends Request {
    user?: TaskOneClass,
}