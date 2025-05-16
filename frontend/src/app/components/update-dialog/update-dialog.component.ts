import { Component,  inject, OnInit, Input} from '@angular/core';
import {CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import {MatDialogModule, MAT_DIALOG_DATA , MatDialogRef, MatDialog} from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-dialog',
  imports: [CommonModule, FormsModule, MatDialogModule],
  standalone: true,
  templateUrl: './update-dialog.component.html',
  styleUrl: './update-dialog.component.css',
})
export class UpdateDialogComponent implements OnInit{
  constructor(private dialogRef: MatDialogRef<UpdateDialogComponent>) {}
  configService = inject(ConfigService);

  @Input() id : number = 0;
  @Input() title: string = '';
  @Input() getData_func_call: any;
  @Input() id_name: string = '';
  @Input() fields: any[] = [];
  @Input() update_function!: (data: any) => Observable<any>;

  allowed_status = ['SCHEDULED', 'CANCELLED', 'IN PROGRESS', 'COMPLETED', 'CONFIRMED'];
  patient_allowed_status = ['CANCELLED'];
  today = new Date().toISOString().split('T')[0];

  slotCorrespondingTime:{ [key: string]: string } = {
    '1': '08:00',
    '2': '11:00',
    '3': '14:00'
  };

  availableSlots: { [key: string]: boolean } = {};
  filteredSlots: string[] = [];



// get available appointment slots based on the chosen date
  getAvailableSlots(date: string){
    this.configService.getAvailableAppointmentByAppointmentId(this.id, date).subscribe(
      (response:any) => {
        this.availableSlots = response;
        this.filteredSlots = Object.keys(this.availableSlots)
          .filter((key: string) => this.availableSlots[key] === true)
          .map((key: string) => this.slotCorrespondingTime[key]);
      },
      (error:any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  userRole: string ="";
  dataSource:  any[] = [];

  formData: any = {};

  ngOnInit(){
    this.getData();

  }


  onFieldChange(fieldName: string, newValue: any): void {
    if (fieldName == "date") {
      this.getAvailableSlots(newValue)
    }
  }

  // get User Role and Data to be processed
  getData(){
    this.configService.getUserRole().subscribe(
      (response:any) => {
        this.userRole = response;

        if (this.getData_func_call) {
          this.getData_func_call.subscribe(
            (response:any) => {
              this.dataSource = response;
              this.get_initialData();

            },
            (error:any) => {
              console.error('Error fetching data:', error);
            }
          );
         }

      },
      (error:any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // set the default values (placeholder) in the displayed form
  get_initialData(): void {
    const element = this.dataSource?.find(d => d[this.id_name] === this.id);
    for (let field of this.fields) {
      if (field.name == "date"){
        this.formData[field.name] = element['date_time'].split('T')[0];
      }

      else if (field.name== "time_slot"){
        this.getAvailableSlots(this.formData["date"])
        this.formData[field.name] = element['date_time'].split('T')[1].slice(0, 5);
      }
      else if (field.name == "status_expiry"){
        this.formData[field.name] = element['status_expiry'].split('T')[0];
      }
      else{
        this.formData[field.name] = element[field.name];
      }
      if (this.userRole == "patient" && field.name =="status"){
        this.patient_allowed_status.push(element[field.name]);
      }
      field.placeholder = this.formData[field.name];
    }
  }

  // call update function in the backend
  updateData(form: NgForm) {
    const updatedData: any = {};
    let set = 0;
    for (let field of this.fields) {
      if(field.name == "date" || field.name == "time_slot"){
        if (set== 0){
          updatedData['date_time']= `${this.formData['date']}T${this.formData['time_slot']}:00.000Z`;
          set = 1;
        }
      }
      else if (field.name == "status_expiry" ){
        updatedData[field.name] =new Date(this.formData[field.name]).toISOString();
      }
      else if (this.title == "appointments" && (field.name =="patient_name"  || field.name =="doctor_name")){
        continue
      }
      else{
        updatedData[field.name] = this.formData[field.name];
      }
    }
    updatedData["id"] = this.id;
    const url$ = this.update_function(updatedData);
    if (url$){
      url$.subscribe(
        (response: any) => {
          this.getData();
        },
        (error: any) => {
          alert(error.error.detail);
          console.error('Error Fetching Data:', error);
        }
      );
    }
    this.dialogRef.close();

    return updatedData;
  }
}




