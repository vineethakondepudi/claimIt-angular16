import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { MatDividerModule } from '@angular/material/divider';
import { ClaimitService } from '../../sharedServices/claimit.service';

@Component({
  selector: 'app-create-claim',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule, 
    MatButtonModule, 
    MatDialogModule,

    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.scss']
})
export class CreateClaimComponent {
  claimForm!: FormGroup;
  enableSave: boolean = true
  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  constructor(private claimService: ClaimitService,@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<CreateClaimComponent>,private fb: FormBuilder) {
    console.log('data',data)

  }
  ngOnInit(){
    this.initializeContactForm()
    this.claimForm.statusChanges.subscribe((res: any) => {
      console.log('res', res)
      if (res === 'VALID') {
        this.enableSave = false
      } else {
        this.enableSave = true

      }
    })
  }
  initializeContactForm() {
    this.claimForm = this.fb.group({
      name: this.fb.control("", Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]),
       message: this.fb.control("")
    })
  }
  get email() {
    return this.claimForm.get('email');
  }
  onCancel(){
    this.dialogRef.close(undefined);

  }
  onSubmit(){
    this.dialogRef.close(this.claimForm);

  }
}
