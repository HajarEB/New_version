import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import {CommonModule } from '@angular/common';
import { Doctor } from '../models/doctor';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit{
  configService = inject(ConfigService);
  router = inject(Router);
  specialties = [
    "General",
    "Allergy and Immunology",
    "Anesthesiology",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Hematology",
    "Infectious Disease",
    "Internal Medicine",
    "Nephrology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedic Surgery",
    "Pediatrics",
    "Plastic Surgery",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Surgery (General Surgery)",
    "Thoracic Surgery",
    "Urology",
    "Vascular Surgery",
    "Dentistry"
  ];


  fields: any[] = [
    { label: 'First Name', name: 'first_name', type: 'text' },
    { label: 'Last Name', name: 'last_name', type: 'text' },
    { label: 'Username', name: 'username', type: 'text' },
    { label: 'Phone Number', name: 'phone_number', type: 'text' },
    { label: 'Email', name: 'email', type: 'text' },
    { label: 'Role', name: 'role', type: 'text' },
  ];

  formData: { [key: string]: any } = {};
  SourceData: { [key: string]: any } = {};

  updateProfile(form: NgForm) {
    const updatedData: any = {};

    for (let field of this.fields) {
      if(field.name != "role"){
        updatedData[field.name] = this.formData[field.name];
      }

    }
    const url$ = this.configService.update_my_profile(updatedData);

    if (url$){
      url$.subscribe(
        (response: any) => {
          this.SourceData = response;
          this.getUserData();
          alert("Profile Successfully Updated");
          this.router.navigateByUrl("/home");

        },
        (error: any) => {
          alert(error.error.detail);
          console.error('Error Fetching Data:', error);
        }
      );
    }
  }
  getUserData(){
    this.configService.getUserInfo().subscribe(
        (response) => {
          this.SourceData = response;
          if ('doctor_specialty' in response) {
            this.fields.push({
              label: 'Specialty',
              name: 'doctor_specialty',
              type: 'text',
              validate: true
            })
          }
          for (let field of this.fields) {
            const value = this.SourceData?.[field.name] || '';
            this.formData[field.name] = value;
            field.placeholder = value;
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
    );

  }
  ngOnInit(): void {
    this.getUserData();
  }
}
