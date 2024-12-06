import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  constructor(private router:Router, private fb: FormBuilder){}
  ngOnInit() {
    console.log('-------');
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    })
    
  }
  onSubmit(){
    const body = {
        "emailId": this.loginForm.get('username')?.value,
        "password": this.loginForm.get('password')?.value
    }
    localStorage.setItem('isLogin','true')
    this.router.navigate(['/claimit/dashboard'])
  }
}
