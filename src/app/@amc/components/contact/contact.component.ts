import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormFooterComponent } from '../form-footer/form-footer.component';
import { FormSubmissionModalComponent } from '../form-submission-modal/form-submission-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    FormFooterComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    LoaderComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export default class ContactComponent {
  supportEmail: any = 'support@lostandfoundapp.com'
  contactForm!: FormGroup;
  enableSave: boolean = true
  isLoading:boolean = false
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  constructor(private fb: FormBuilder, public dialog: MatDialog, private service:ClaimitService) {

  }
  ngOnInit() {
    this.initializeContactForm()
  }
  initializeContactForm() {
    this.contactForm = this.fb.group({
      name: this.fb.control("", Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]),
      message: this.fb.control("")
    })
  }
  get email() {
    return this.contactForm.get('email');
  }
  contactUs() {
    this.isLoading  = true;
    const reqbody = {
      name: this.contactForm.value.name ? this.contactForm.value.name : '',
      mail: this.contactForm.value.email ? this.contactForm.value.email : '',
      message: this.contactForm.value.message ? this.contactForm.value.message : '',      
    }
    this.service.contactUs(reqbody).subscribe(
      (res: any) => {
        this.isLoading  = false;
      })
   
      
  }
}
