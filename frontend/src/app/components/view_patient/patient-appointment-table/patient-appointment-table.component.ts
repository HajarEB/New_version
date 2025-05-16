import { Component , OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../services/config.service';
import { Appointment } from '../../../models/appointment';
import { InfoTableComponent } from '../../info-table/info-table.component';
import {CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-appointment-table',
  imports: [InfoTableComponent, CommonModule],
  templateUrl: './patient-appointment-table.component.html',
  styleUrl: './patient-appointment-table.component.css'
})


export class PatientAppointmentTableComponent implements OnInit{
  constructor(public dialog: MatDialog, private configService: ConfigService) {}
  getData_func_call: any;

  // UpdateAppointmentDialogComponent = UpdateAppointmentDialogComponent;
  id_name = "appointment_id";
  columns: string[] = ['actions', 'doctor_name', 'date','time','specialty', 'description', 'status'];
  dataSource: Appointment[] = [];

  // get all patient appointments data
  getAppointments(){
      this.configService.getPatientAppointments().subscribe(
        (response) => {
          this.dataSource = response;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  ngOnInit():void{
      this.getData_func_call = this.configService.getPatientAppointments();
      this.getAppointments();
  }

}

