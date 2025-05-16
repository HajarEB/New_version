import { Injectable, Type } from '@angular/core';
import { DoctorUpdateAppointmentDialogComponent } from '../components/view_doctor/doctor-update-appointment-dialog/doctor-update-appointment-dialog.component';
import { PatientUpdateAppointmentDialogComponent } from '../components/view_patient/patient-update-appointment-dialog/patient-update-appointment-dialog.component';
import { AdminUpdateAdminDialogComponent } from '../components/view_admin/admin-update-admin-dialog/admin-update-admin-dialog.component';
import { AdminUpdateDoctorDialogComponent } from '../components/view_admin/admin-update-doctor-dialog/admin-update-doctor-dialog.component';
import { AdminUpdatePatientDialogComponent } from '../components/view_admin/admin-update-patient-dialog/admin-update-patient-dialog.component';
import { AdminUpdateAppointmentDialogComponent } from '../components/view_admin/admin-update-appointment-dialog/admin-update-appointment-dialog.component';

@Injectable({
  providedIn: 'root'
})

// This service is used to avoid circular dependencies
export class ComponentRegistryService {
  constructor() { }
  private registry: Record<string, Type<any>> = {
    'patient-update-appointment': PatientUpdateAppointmentDialogComponent,
    'doctor-update-appointment': DoctorUpdateAppointmentDialogComponent,
    'admin-update-doctor': AdminUpdateDoctorDialogComponent,
    'admin-update-appointment': AdminUpdateAppointmentDialogComponent,
    'admin-update-patient': AdminUpdatePatientDialogComponent,
    'admin-update-admin':AdminUpdateAdminDialogComponent
  };

  getComponent(key: string): Type<any> | undefined {
    return this.registry[key];
  }
}
