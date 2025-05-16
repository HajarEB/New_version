import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  
  // Check if we are in the browser environment
  if (typeof window !== 'undefined' && window.localStorage) {
    const loggedData = localStorage.getItem("token");
    
    // If token exists, allow access
    if (loggedData != null) {
      return true;
    } else {
      // If token is not found, redirect to login
      router.navigateByUrl("login");
      return false;
    }
  }

  // If we are not in the browser, deny access or handle accordingly
  return false;
};
