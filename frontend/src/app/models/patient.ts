import { User } from './user';

export interface Patient extends User {
  patient_id?: number,
  status_expiry?: string,
  patient_name?: string,
}
