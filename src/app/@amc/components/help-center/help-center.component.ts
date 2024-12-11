import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormFooterComponent } from '../form-footer/form-footer.component';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, FormFooterComponent, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export default class HelpCenterComponent {
  supportEmail: string = 'support@helpapp.com';
  helpForm!: FormGroup;
  enableSave: boolean = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeHelpForm();
    this.helpForm.statusChanges.subscribe((res: any) => {
      this.enableSave = res !== 'VALID';
    });
  }

  initializeHelpForm() {
    this.helpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      request: ['', Validators.required]
    });
  }

  get email() {
    return this.helpForm.get('email');
  }

  submitRequest() {
    console.log('Request submitted:', this.helpForm.value);
    this.helpForm.reset();
  }
}
