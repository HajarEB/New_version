import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../../update-dialog/update-dialog.component';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'patient-update-appointment-dialog',
  imports: [CommonModule, MatDialogModule, UpdateDialogComponent],
  templateUrl: './patient-update-appointment-dialog.component.html',
  styleUrl: './patient-update-appointment-dialog.component.css'
})

export class PatientUpdateAppointmentDialogComponent  {
  configService = inject(ConfigService);
  id: number;
  title: string;
  getData_func_call: any;
  id_name:string;

  fields = [
    { label: 'Doctor Name', name: 'doctor_name', type: 'text'},
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

