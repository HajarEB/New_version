import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';
import { Patient } from '../models/patient';
import { Doctor } from '../models/doctor';
import { Admin } from '../models/admin';


// to inject services on other places
@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  private config: any;
  constructor(private http: HttpClient){
    this.config = {
      "base_url": "https://localhost:8432/",
    };
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getBaseUrl(): String{
    return this.config.base_url
  }

  getUserRole(): Observable<any>{
    const user_url =this.config.base_url+ 'users/getUserRole/';
    return this.http.post(user_url,{});
  }


  getAppointmentData(): Observable<any>{
    const appointment_url = this.config.base_url + "appointments/getAllAppointments";
    return this.http.post(appointment_url,{});
  }

  admin_update_appointmentData(updatedAppointment: Appointment): Observable<any>{
    const appointment_url = `${this.config.base_url}appointments/adminUpdateAppointment/`;
    return this.http.put(appointment_url, updatedAppointment);
  }

  getPatientData(): Observable<any>{
    const patient_url = this.config.base_url + "patients/getAllPatients";
    return this.http.post(patient_url,{});
  }

  update_patient_status_expiry(updatedPatient: Patient): Observable<any>{
    const patient_url = `${this.config.base_url}patients/update_patient_status_expiry/`;
    return this.http.put(patient_url, updatedPatient);
  }

  getDoctorData(): Observable<any>{
    const doctor_url = this.config.base_url + "doctors/getAllDoctors";
    return this.http.post(doctor_url,{});
  }


  update_doctor_status_expiry( updatedDoctor: Doctor): Observable<any>{
    const doctor_url = `${this.config.base_url}doctors/update_doctor_status_expiry/`;
    return this.http.put(doctor_url, updatedDoctor);
  }

  getNonAssignedUsers(){
    const admin_url = this.config.base_url + "admins/getNonAssignedUsers";
    return this.http.post(admin_url,{});
  }
  isDefaultAdmin(): Observable<any>{
    const admin_url = this.config.base_url + "admins/isDefaultAdmin";
    return this.http.get(admin_url);
  }
  updateRole(updatedUser:any){
    const admin_url = `${this.config.base_url}admins/updateRole`;
    return this.http.put(admin_url, updatedUser);
  }
  getAdminData(): Observable<any>{
    const admin_url = this.config.base_url + "admins/getAllAdmins";
    return this.http.post(admin_url,{});
  }

  update_admin_status_expiry(updatedAdmin: Admin): Observable<any>{
      const admin_url = `${this.config.base_url}admins/update_admin_status_expiry`;
      return this.http.put(admin_url, updatedAdmin);
  }


  getDoctorAppointments(): Observable<any>{
    const doctor_url = this.config.base_url+ 'appointments/getDoctorAppointments/';
    return this.http.post(doctor_url,{});
  }

  getPatientAppointments(): Observable<any>{

    const doctor_url = this.config.base_url + 'appointments/getPatientAppointments/';
    return this.http.post(doctor_url,{});
  }

  user_update_appointmentData(updatedAppointment: Appointment): Observable<any>{
    const appointment_url = `${this.config.base_url}appointments/userUpdateAppointment/`;
    return this.http.put(appointment_url, updatedAppointment);
  }
  getUserInfo(): Observable<any>{
    const user_url = this.config.base_url +'users/getUserInfo/';
    return this.http.post(user_url,{});
  }
  update_my_profile(updatedProfile: Doctor):Observable<any>{
    const user_url = this.config.base_url + "users/updateMyProfile/";
    return this.http.put(user_url, updatedProfile);
  }
  getAvailableAppointmentByAppointmentId(appointment_id: number, date: string): Observable<any>{
    const user_url = this.config.base_url +'appointments/getAvailableAppointmentByAppointmentId/';
    const body = {
      appointment_id,
      date
    };
    return this.http.post(user_url, body);
  }
  logOut():Observable<any>{
    const user_url = this.config.base_url + "auth/logout/";
    return this.http.post(user_url,{});
  }

  CreateNewAppointment(form: any):Observable<any>{
    const user_url = this.config.base_url + "appointments/CreateNewAppointment/";
    return this.http.post(user_url,form);
  }
  getAvailableAppointment(form: any):Observable<any>{
    const user_url = this.config.base_url + "appointments/getAvailableAppointment/";
    return this.http.post(user_url,form);
  }
  getAllSpecialty():Observable<any>{
    const user_url = this.config.base_url + "doctors/getAllSpecialty/";
    return this.http.get(user_url);
  }
  register(form: any):Observable<any>{
    const user_url = this.config.base_url + "auth/register/";
    return this.http.post(user_url,form);
  }
  login(body: any, header: any):Observable<any>{
    const user_url = this.config.base_url + "auth/login/";
    return this.http.post(user_url,body, { headers: header });
  }
  setTokenToExpired(token: string):Observable<any>{
    const user_url = `${this.config.base_url}auth/setTokenToExpired/`;
    return this.http.post(user_url, {token});
  }

}
