import { Component , OnInit, inject} from '@angular/core';
import { InfoTableComponent } from "../../info-table/info-table.component";
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../../../services/config.service';
import { Doctor } from '../../../models/doctor';
import {CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-doctor-table',
  imports: [InfoTableComponent, CommonModule],
  standalone: true,
  templateUrl: './admin-doctor-table.component.html',
  styleUrl: './admin-doctor-table.component.css'
})
export class AdminDoctorTableComponent implements OnInit{
  constructor(public dialog: MatDialog, private configService: ConfigService) {}



  columns: string[] = [ 'actions','doctor_name', 'username', 'email', 'phone_number', 'specialty', 'status_expiry'];

  id_name = "doctor_id";
  getData_func_call: any;
  dataSource: string = "";


  // get all doctors data
  getAllDoctors(){
    this.configService.getDoctorData().subscribe(
      (response) => {
        this.dataSource = response;
        console.log(this.dataSource)
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  ngOnInit():void{
    this.getData_func_call = this.configService.getDoctorData();
  }

}
