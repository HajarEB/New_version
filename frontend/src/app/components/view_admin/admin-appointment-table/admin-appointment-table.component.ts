import { Component , OnInit, inject} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../services/config.service';
import { Appointment } from '../../../models/appointment';
import { InfoTableComponent } from '../../info-table/info-table.component';

import {CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-appointment-table',
  imports: [InfoTableComponent, CommonModule],
  standalone: true,
  templateUrl: './admin-appointment-table.component.html',
  styleUrl: './admin-appointment-table.component.css'
})
export class AdminAppointmentTableComponent implements OnInit{
  constructor(public dialog: MatDialog, private configService: ConfigService) {}
  getData_func_call: any;

  id_name = "appointment_id";

  columns: string[] = ['actions', 'patient_name', 'doctor_name', 'date','time', 'description', 'status'];
  dataSource: Appointment[] = [];



  // get all appointments data
  getAllAppointments(){
    this.configService.getAppointmentData().subscribe(
      (response) => {
        this.dataSource = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit():void{
    this.getData_func_call = this.configService.getAppointmentData();
    this.getAllAppointments();
  }

}


