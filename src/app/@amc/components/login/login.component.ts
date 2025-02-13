import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from '../header/header.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, MatFormFieldModule, HeaderComponent, MatInputModule, LoaderComponent, MatButtonModule, RouterModule, ReactiveFormsModule,
    MatCheckboxModule, MatSnackBarModule, MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  loginForm!: FormGroup;
  errMsg: any;
  isLoading:boolean = false;
  hidePassword = true;
  isMobileView = false;
  
  constructor(private router: Router, private fb: FormBuilder, private service: ClaimitService,
              private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.checkViewport();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  
  onSubmit() { 
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
   this.isLoading = true
      this.service.adminLogin(email, password).subscribe(
        (response: any) => {
          this.isLoading = false
          if (response.isAdmin) {
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('role', 'admin');
            this.router.navigate(['/claimit/addItem']);
            this.service.loginResponse.next(true)
          } else {
            this.isLoading = false
            this.showToast(response.message);
          }
        },
        (error: any) => {
          this.isLoading = false
          this.showToast(error.message || 'An unexpected error occurred.');
        }
      );
    }
  
  }
  
  @HostListener('window:resize', ['$event'])
    onResize() {
      this.checkViewport();
    }
    checkViewport() {
      this.isMobileView = window.innerWidth <= 768; // Mobile breakpoint
    }
  userNavigate(){
    localStorage.setItem('isLogin', 'true');
    localStorage.setItem('role', 'user');
    this.router.navigate(['/claimit/dashboard']);
    this.service.loginResponse.next(true)
  }
  
}
