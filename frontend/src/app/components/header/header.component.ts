import { Component, inject, OnInit } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../AuthService/authService';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  configService = inject(ConfigService);
  router = inject(Router);

  authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  role = "";
  isAdmin: boolean = false;
  isDoctor: boolean = false;
  isPatient: boolean = false;
  isDefaultAdmin: boolean = false;
  isUser: boolean = false;
  getRole(){
    this.configService.getUserRole().subscribe(
      (response:any) => {
        this.role = response;
        if (this.role == "admin"){
          this.isAdmin = true;
          this.configService.isDefaultAdmin().subscribe(
            (response:any) => {
              this.isDefaultAdmin = response;
            },
            (error:any) => {
              console.error('Error fetching data:', error);
            }
          );
        }
        else if (this.role == "doctor"){
          this.isDoctor = true;
        }
        else if (this.role == "patient"){
          this.isPatient = true;
        }
        else{
          this.isUser = true;
        }

      },
      (error:any) => {
        console.error('Error fetching data:', error);
      }
    );

  }
  ngOnInit(): void {
    this.getRole();
  }
  onLogOff(){
    this.authService.logOut();
  }

}
