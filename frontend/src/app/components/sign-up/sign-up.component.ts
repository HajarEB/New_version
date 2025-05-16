import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent{
  configService = inject(ConfigService);
  router = inject(Router);
  isWeakPassword = false;

  registerForm: any = {
    "username": "",
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone_number": "",
    "password": ""
  }

  onSignUp(){

    if (this.registerForm.username != "", this.registerForm.password != ""){
      const formValue = this.registerForm;
      this.configService.register(formValue).subscribe((res:any)=>{
        alert(res.message)
        this.router.navigateByUrl("login")
      }, (error: HttpErrorResponse)=>{
        console.error(error);
        if (error.error && error.error.detail) {
          alert(`Signup failed: ${error.error.detail}`);
          if (error.error.detail == "Weak Password!"){
            this.isWeakPassword = true;
          }
        } else {
          alert("Signup failed: An Unexpected Error Occurred.");
        }
      })
    } else {
      alert("Username and Password Required")
    }
    const consent = window.confirm(
    `By registering, You Allow us To:
  1. Use Your Data For Medical Purposes Only
  2. Share Your Data With Your Doctor And Supporting Staff
  3. Store And Process Your Data Securely

    ***Note: You Are Allowed To Withdraw Consent or Update Your Personal Data Through Profile Page At Any Time

  For Data Regulation Inquires, Contact: dt_center@hospitalapp.ma`
  );

  if (!consent) {
    alert('You Must Accept GDPR Consent To Register.');
    return;
  }

  }

}
