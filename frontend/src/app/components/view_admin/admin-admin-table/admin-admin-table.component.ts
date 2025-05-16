import { Component, inject, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { Admin } from '../../../models/admin';
import { MatDialog } from '@angular/material/dialog';
import { InfoTableComponent } from "../../info-table/info-table.component";
import {CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-admin-table',
  imports: [InfoTableComponent, CommonModule],
  standalone: true,
  templateUrl: './admin-admin-table.component.html',
  styleUrl: './admin-admin-table.component.css'
})
export class AdminAdminTableComponent implements OnInit{
  constructor(public dialog: MatDialog, private configService: ConfigService) {}

  columns: string[] = [ 'actions','admin_name', 'username', 'email', 'phone_number', 'status_expiry'];

  id_name = "admin_id";

  dataSource: Admin[] = [];
  getData_func_call: any;

  // get all admins data
  getAllAdmins(){
    this.configService.getAdminData().subscribe(
      (response) => {
        this.dataSource = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


  ngOnInit():void{
    this.getData_func_call = this.configService.getAdminData();
    this.getAllAdmins();
  }
}
