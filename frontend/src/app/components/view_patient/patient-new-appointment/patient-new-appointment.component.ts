import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-patient-new-appointment',
  imports: [FormsModule, CommonModule],
  templateUrl: './patient-new-appointment.component.html',
  styleUrl: './patient-new-appointment.component.css'
})
export class PatientNewAppointmentComponent {
  configService = inject(ConfigService);
  router = inject(Router);

  today: string = "";
  specialtyList: any [] = [];
  selectedSpecialty: string = '';
  doctorsAvailable: any [] = [];
  clickedCheck: boolean = false;

  constructor(){
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0]; 
  }

  checkForm: any = {
      "doctor_id": 0,
      "specialty": "",
      "date": ""
  }
  createForm: any = {
    "patient_id": 0,
    "date": "",
    "doctor_id": 0,
    "time_slot": 0,
    "description": ""
  }

  getSpecialty() {
    this.configService.getAllSpecialty().subscribe((res: any) => {
      this.specialtyList = res;
    }, (error: any) => {
      alert(error.error.detail);
      console.error('Error Fetching Data:', error);
    });
  }

  getAvailableAppointment(){
    if (this.checkForm.specialty != "" , this.checkForm.date != ""){
      this.configService.getAvailableAppointment(this.checkForm).subscribe((res: any) => {
        this.doctorsAvailable = res.details;
        this.clickedCheck = true;
      }, (error: any) => {
        alert(error.error.detail);
        console.error('Error Fetching Data:', error);
      });
    } else {
      alert("Select specialty and date")
    }
  }

  ngOnInit(): void {
    this.getSpecialty();
  }

  onCreate(){
    if (this.createForm.doctor_id != 0, this.createForm.time_slot != 0){

      this.configService.CreateNewAppointment(this.createForm).subscribe((res: any) => {
        alert(res)
      this.getAvailableAppointment()
      this.router.navigateByUrl("/home");
     }, (error: any) => {
       alert(error.error.detail);
       console.error('Error Fetching Data:', error);
     });
    } else {
      alert("Select one doctor and suitable time slot")
    }
  }
}
