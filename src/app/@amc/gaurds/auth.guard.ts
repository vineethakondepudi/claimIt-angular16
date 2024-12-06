import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard{

  constructor(private router: Router) {}

  canActivate() {
    if (localStorage.getItem('isLogin')) {
      return true; // Allow access
    } else {
      this.router.navigate(['/login']); // Redirect to login page
      return false; // Block access
    }
  }
}
