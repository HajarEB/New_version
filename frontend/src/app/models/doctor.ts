import { User } from './user';

export interface Doctor extends User {
  doctor_id?: number,
  doctor_specialty?: string
}
