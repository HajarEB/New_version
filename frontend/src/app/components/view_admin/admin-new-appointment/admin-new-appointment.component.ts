import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-admin-new-appointment',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-new-appointment.component.html',
  styleUrl: './admin-new-appointment.component.css'
})
export class AdminNewAppointmentComponent {
  configService = inject(ConfigService);
  router = inject(Router);

  today: string = "";
  specialtyList: any [] = [];
  selectedSpecialty: string = '';
  doctorsAvailable: any [] = [];
  patientsData: any [] = [];
  clickedCheck: boolean = false;

  constructor(){
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0]; // only get YYYY-MM-DD
  }

  checkForm: any = {
      "doctor_id": 0,
      "specialty": "",
      "date": ""
  }
  createForm: any = {
    "patient_id": "",
    'date': "",
    'doctor_id': "",
    'time_slot': 0,
    'description': "",
    "doctor_name": ""
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
    this.getSpecialty();
    this.getPatientData();
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0]; // only get YYYY-MM-DD
  }

  onCreate(){
    if (this.createForm.doctor_id != "", this.createForm.patient_id != "", this.createForm.time_slot != 0){

      this.configService.CreateNewAppointment(this.createForm).subscribe((res: any) => {
        alert(res)
      this.getAvailableAppointment()
      this.router.navigateByUrl("/home");
     }, (error: any) => {
       alert(error.error.detail);
       console.error('Error Fetching Data:', error);
     });
    } else {
      alert("Please select all the fields")
    }
  }
}
