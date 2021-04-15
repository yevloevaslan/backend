import { } from './index';
import { IUser } from '../../entities/User.entity';

export interface UserClassInterface {
  //updateTask(data: ): void;
  data(): IUser;
}