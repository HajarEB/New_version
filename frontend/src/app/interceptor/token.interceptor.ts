import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthService/authService';
import { jwtDecode } from 'jwt-decode';



export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem("token");
  const newReq = req.clone({
    setHeaders:{
      Authorization: `Bearer ${token}`
    }
  })
  if (token){
    let decodedToken = jwtDecode(token);
    const time_now = Date.now() / 1000;
    const isTokenExpired = decodedToken && decodedToken.exp? time_now > decodedToken.exp: false;
    if(isTokenExpired){
      localStorage.removeItem("token");
      authService.setTokenToExpired(token);
    }
    return next(newReq);
  }
  return next(req);

};
