import { Component , OnInit, inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {CommonModule } from '@angular/common';
import { ConfigService } from '../../../services/config.service';
import { Patient } from '../../../models/patient';
import { InfoTableComponent } from '../../info-table/info-table.component';


@Component({
  selector: 'app-admin-patient-table',
  imports: [InfoTableComponent, CommonModule],
  standalone: true,
  templateUrl: './admin-patient-table.component.html',
  styleUrl: './admin-patient-table.component.css'
})
export class AdminPatientTableComponent implements OnInit{

  constructor(public dialog: MatDialog, private configService: ConfigService) {}

  getData_func_call: any;

  columns: string[] = [ 'actions','patient_name', 'username', 'email', 'phone_number', 'status_expiry'];

  id_name = "patient_id";


  dataSource: Patient[] = [];

  // get all patients data
  getAllPatients(){

    this.configService.getPatientData().subscribe(
      (response) => {
        this.dataSource = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit():void{
    this.getData_func_call = this.configService.getPatientData();
    this.getAllPatients();
  }

}
