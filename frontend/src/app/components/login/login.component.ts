import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ConfigService } from '../../services/config.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterOutlet, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  configService = inject(ConfigService);
  apiObj: any = {
    "username":"",
    "password":""
  }
  router = inject(Router);

  onLogin(){
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = `username=${this.apiObj.username}&password=${this.apiObj.password}`;
    this.configService.login(body,  headers ).subscribe((res:any)=>{
      localStorage.setItem("token",res.access_token);
      this.router.navigateByUrl("/home")

    }, error=>{
      console.error("Login failed:", error);
      alert("Username or password is incorrect");
    })
  }
}
