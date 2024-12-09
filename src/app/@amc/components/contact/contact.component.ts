import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormFooterComponent } from '../form-footer/form-footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    FormFooterComponent,
    ReactiveFormsModule,
    MatFormFieldModule, // For mat-form-field
    MatInputModule, // For matInput
    MatIconModule, // For mat-icon
    MatButtonModule, // For mat-raised-button
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export default class ContactComponent {
  supportEmail: any = 'support@lostandfoundapp.com'
  contactForm!: FormGroup;
  enableSave: boolean = true
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  constructor(private fb: FormBuilder) {

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
  }
}
