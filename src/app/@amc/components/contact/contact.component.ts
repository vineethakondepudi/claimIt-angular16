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
    MatButtonModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export default class ContactComponent {
  supportEmail: any = 'support@lostandfoundapp.com'
  contactForm!: FormGroup;
  enableSave: boolean = true
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  constructor(private fb: FormBuilder, public dialog: MatDialog,) {

  }
  ngOnInit() {
    this.initializeContactForm()
    this.contactForm.statusChanges.subscribe((res: any) => {
      console.log('res', res)
      if (res === 'VALID') {
        this.enableSave = false
      } else {
        this.enableSave = true

      }
    })
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
    console.log(this.contactForm)
    const dialogRef = this.dialog.open(FormSubmissionModalComponent, {
      width: "500px",
      data: {
        status: 'Success',
        msg: 'Thank you! Our team will reach out to you shortly.',
        btnName: "OK",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.contactForm.reset({
        name: '',   
        email: '',   
        message: ''  
      });
      
    });
  }
}
