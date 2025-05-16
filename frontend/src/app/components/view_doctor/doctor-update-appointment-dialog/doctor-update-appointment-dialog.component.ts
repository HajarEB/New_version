import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../../update-dialog/update-dialog.component';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-doctor-update-appointment-dialog',
  imports: [CommonModule, MatDialogModule, UpdateDialogComponent],
  templateUrl: './doctor-update-appointment-dialog.component.html',
  styleUrl: './doctor-update-appointment-dialog.component.css'
})
export class DoctorUpdateAppointmentDialogComponent {
  configService = inject(ConfigService);

  id: number; //appointment_id
  title: string; //appointments
  getData_func_call: any; // getDoctorAppointments()
  id_name:string; //appointment_id

  fields = [
    { label: 'Patient Name', name: 'patient_name', type: 'text'},
    { label: 'Description', name: 'description', type: 'text'},
    { label: 'Date', name: 'date', type: 'date'},
    { label: 'Slot', name: 'time_slot', type: 'text'},
    { label: 'Status', name: 'status', type: 'text', validate: true },
  ];
  update_function = this.configService.user_update_appointmentData.bind(this.configService);


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id;
    this.title = data.title;
    this.getData_func_call = data.getData_func_call; //to get initial data
    this.id_name = data.id_name;
  }
}
