import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-doctor-new-appointment',
  imports: [FormsModule, CommonModule],
  templateUrl: './doctor-new-appointment.component.html',
  styleUrl: './doctor-new-appointment.component.css'
})
export class DoctorNewAppointmentComponent {
  configService = inject(ConfigService);
  router = inject(Router);

  today: string = "";
  doctorsAvailable: any [] = [];
  clickedCheck: boolean = false;
  patientsData: any [] = [];

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

  getUserData(){
    this.configService.getUserInfo().subscribe(
        (response) => {
          this.checkForm.doctor_id = response.doctor_id;
          this.checkForm.specialty = response.doctor_specialty;
          this.createForm.doctor_name = response.first_name +' '+ response.last_name;
          this.createForm.doctor_id = response.doctor_id;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
    );
  }

  getAvailableAppointment(){
    if (this.checkForm.date != ""){
      this.configService.getAvailableAppointment(this.checkForm).subscribe((res: any) => {
        this.doctorsAvailable = res.details;
        this.clickedCheck = true;
      }, (error: any) => {
        alert(error.error.detail);
        console.error('Error Fetching Data:', error);
      });
    } else {
      alert("Select date!")
    }
  }

  getPatientData(){
    this.configService.getPatientData().subscribe(
      (response) => {
        this.patientsData = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  ngOnInit(): void {
    this.getUserData();
    this.getPatientData();
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0]; // only get YYYY-MM-DD
  }

  onCreate(){
    if (this.createForm.doctor_name != "", this.createForm.time_slot != 0){

      this.configService.CreateNewAppointment(this.createForm).subscribe((res: any) => {
        alert(res)
      this.getAvailableAppointment()
      this.router.navigateByUrl("/home");
     }, (error: any) => {
       alert(error.error.detail);
       console.error('Error Fetching Data:', error);
     });
    } else {
      alert("Select suitable time slot")
    }
  }
}
