

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from '../header/header.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,MatFormFieldModule,HeaderComponent, MatInputModule, MatButtonModule,RouterModule, ReactiveFormsModule,
    MatCheckboxModule
   ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  loginForm!: FormGroup;
  errMsg: any;
  itemFamilyRequiredError: boolean = false;
  itemFamilyRequiredErrorMessage: string = '';
  constructor(private router:Router, private fb: FormBuilder){}
  ngOnInit() {
    console.log('-------');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
    
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      if (email === 'pgupta@miraclesoft.com' && password === 'Gupta@123') {
        localStorage.setItem('isLogin','true')
        localStorage.setItem('role', 'admin');
        this.router.navigate(['/claimit/dashboard']); // Corrected navigation path
      } else if (
        (email === 'vkondepudi@miraclesoft.com' && password === 'Vinnu@123') ||
        (email === 'vpidugu@miraclesoft.com' && password === 'Vani@123')
      ) {
        localStorage.setItem('isLogin','true')
        localStorage.setItem('role', 'user');
        this.router.navigate(['/claimit/dashboard']); // Corrected navigation path
      } else {
        this.itemFamilyRequiredError = true;
        this.itemFamilyRequiredErrorMessage = 'Invalid email or password. Please try again.';
      }
    }
  }
  
  
}
