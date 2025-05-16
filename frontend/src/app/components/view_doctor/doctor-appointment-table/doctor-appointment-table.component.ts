import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../models/appointment';
import { ConfigService } from '../../../services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoTableComponent } from "../../info-table/info-table.component";
import {CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-appointment-table',
  imports: [InfoTableComponent, CommonModule],
  templateUrl: './doctor-appointment-table.component.html',
  styleUrl: './doctor-appointment-table.component.css'
})
export class DoctorAppointmentTableComponent implements OnInit{
  constructor(public dialog: MatDialog, private configService: ConfigService) {}
  getData_func_call: any;

  id_name = "appointment_id";


  columns: string[] = ['actions', 'patient_name', 'date','time', 'description', 'status'];
  dataSource: Appointment[] = [];
  _filterText: string = '';

  // get all doctor appointments data
  getAppointments(){
    this.configService.getDoctorAppointments().subscribe(
      (response) => {
        this.dataSource = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit():void{
    this.getData_func_call = this.configService.getDoctorAppointments();
    this.getAppointments();
  }

}

