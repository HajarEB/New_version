import { Component, Inject, inject,Input, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormsModule, NgForm } from '@angular/forms';
import {CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MAT_DIALOG_DATA , MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-assign-user-dialog',
  imports: [ FormsModule, CommonModule, MatSelectModule,
    MatInputModule, MatFormFieldModule, MatDialogModule],
  templateUrl: './assign-user-dialog.component.html',
  styleUrl: './assign-user-dialog.component.css'
})
export class AssignUserDialogComponent  implements OnInit{

  dialogRef = inject(MatDialogRef<AssignUserDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  updatedData: any = {};
  configService = inject(ConfigService);
  isDoctor: boolean = false;
  isPatient: boolean = false;
  isAdmin: boolean  = false;
  selectedUserID: number = 0;
  dataSource:  any[] = [];
  ngOnInit(): void {
    this.getInitialData();
  }
  assignUser() {
    if(this.selectedUserID == 0){
      alert("No User Selected");
      this.dialogRef.close();
    }
    else{
      this.updatedData["user_id"] = this.selectedUserID;
      this.configService.updateRole( this.updatedData).subscribe(
        (response:any) => {
          this.dataSource = response;
          this.dialogRef.close();

        },
        (error:any) => {
          alert(error.error.detail);
          console.error('Error fetching data:', error);
          this.dialogRef.close();
        }
      );
    }

  }


  getInitialData(){
    this.configService.getNonAssignedUsers().subscribe(
      (response:any) => {
        this.dataSource = response;
      },
      (error:any) => {
        alert(error.error.detail);
        console.error('Error fetching data:', error);
      }
    );
    if (this.data.title == "patients"){
      this.isPatient = true;
      this.updatedData["new_role"] = "patient";
    }
    else if(this.data.title == "doctors"){
      this.isDoctor= true;
      this.updatedData["new_role"] = "doctor";
    }
    else if(this.data.title == "admins"){
      this.isAdmin = true;
      this.updatedData["new_role"] = "admin";
    }

  }




}
