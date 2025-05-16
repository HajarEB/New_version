export interface Appointment {

  appointment_id?: number, 
  patient_name: string,
  patient_id?:number,
  doctor_name: string,
  doctor_id?:number,
  date_time: string,
  description: string,
  status: string,
}
