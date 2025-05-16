
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  configService = inject(ConfigService);
  router = inject(Router);
  logOut(){
    this.configService.logOut().subscribe(
      (response: any) => {
        localStorage.removeItem("token");
        this.router.navigateByUrl("login");
      },
      (error: any) => {
        alert(error.error.detail);
        console.error('Error Fetching Data:', error);
      }
    );
  }
  setTokenToExpired(token: string){
    this.configService.setTokenToExpired(token).subscribe(
      (response: any) => {
        this.router.navigateByUrl("login");
        alert("Session Expired !! Please Log in Again to Continue");
      },
      (error: any) => {
        alert(error.error.detail);
        console.error('Error Fetching Data:', error);
      }
    );
  }
}
