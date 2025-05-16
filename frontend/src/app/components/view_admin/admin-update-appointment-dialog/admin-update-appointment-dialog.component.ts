import { Component,  inject, OnInit, Input, Inject} from '@angular/core';
import {MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { UpdateDialogComponent } from '../../update-dialog/update-dialog.component';
import { ConfigService } from '../../../services/config.service';


@Component({
  selector: 'app-admin-update-appointment-dialog',
  imports: [MatDialogModule, UpdateDialogComponent],
  standalone: true,
  templateUrl: './admin-update-appointment-dialog.component.html',
  styleUrl: './admin-update-appointment-dialog.component.css'
})
export class AdminUpdateAppointmentDialogComponent  implements OnInit{
  configService = inject(ConfigService);
  id: number;
  title: string;
  getData_func_call: any;
  id_name:string;
  update_function = this.configService.admin_update_appointmentData.bind(this.configService);
  fields = [
    { label: 'Patient Name', name: 'patient_name', type: 'text'},
    { label: 'Doctor Name', name: 'doctor_name', type: 'text'},
    { label: 'Description', name: 'description', type: 'text'},
    { label: 'Date', name: 'date', type: 'date'},
    { label: 'Slot', name: 'time_slot', type: 'text'},
    { label: 'Status', name: 'status', type: 'text', validate: true }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id;
    this.title = data.title;
    this.getData_func_call = data.getData_func_call;
    this.id_name = data.id_name;
  }

  ngOnInit(): void {

  }


}
