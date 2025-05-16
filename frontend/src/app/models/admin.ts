import { User } from './user';

export interface Admin extends User {
  admin_id?: number
}
