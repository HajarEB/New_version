import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { authGuard } from './guard/auth.guard';
import { SignUpComponent } from './components/sign-up/sign-up.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path:'',
    component:HeaderComponent,
    canActivate: [authGuard],
    children:[
      {
        path: 'home',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./home/home.component').then((m)=> m.HomeComponent);
        }
      },
      {
        path: 'Appointments_Admin_View',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./components/view_admin/admin-appointment-table/admin-appointment-table.component').then((m)=> m.AdminAppointmentTableComponent);
        }
      },
      {
        path: 'Patients_Admin_View',
        pathMatch:'full',
        loadComponent: () =>{

          return import('./components/view_admin/admin-patient-table/admin-patient-table.component').then((m)=> m.AdminPatientTableComponent);
        }
      },
      {
        path: 'Admins_Default_Admin_View',
        pathMatch:'full',
        loadComponent: () =>{

          return import('./components/view_admin/admin-admin-table/admin-admin-table.component').then((m)=> m.AdminAdminTableComponent);
        }
      },
      {
        path: 'Doctors_Admin_View',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./components/view_admin/admin-doctor-table/admin-doctor-table.component').then((m)=> m.AdminDoctorTableComponent);
        }
      },
      {
        path: 'Appointments_Doctor_View',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./components/view_doctor/doctor-appointment-table/doctor-appointment-table.component').then((m)=> m.DoctorAppointmentTableComponent);
        }
      },
      {
        path: 'Appointments_Patient_View',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./components/view_patient/patient-appointment-table/patient-appointment-table.component').then((m)=> m.PatientAppointmentTableComponent);
        }
      },
      {
        path: 'my_Profile',
        pathMatch:'full',
        loadComponent: () =>{
          return import('./my-profile/my-profile.component').then((m)=> m.MyProfileComponent);
        }
      },
      {
        path: 'admin_new_appointment',
        pathMatch: 'full',
        loadComponent: () =>{
          return import('./components/view_admin/admin-new-appointment/admin-new-appointment.component').then((m)=> m.AdminNewAppointmentComponent);
        }
      },
      {
        path: 'patient_new_appointment',
        pathMatch: 'full',
        loadComponent: () =>{
          return import('./components/view_patient/patient-new-appointment/patient-new-appointment.component').then((m)=> m.PatientNewAppointmentComponent);
        }
      },
      {
        path: 'doctor_new_appointment',
        pathMatch: 'full',
        loadComponent: () =>{
          return import('./components/view_doctor/doctor-new-appointment/doctor-new-appointment.component').then((m)=> m.DoctorNewAppointmentComponent);
        }
      }
    ]
  },
];
