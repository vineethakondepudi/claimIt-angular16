import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormSubmissionModalComponent } from 'src/app/@amc/components/form-submission-modal/form-submission-modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reject-claim',
  standalone: true,
  imports: [CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,],
  templateUrl: './reject-claim.component.html',
  styleUrls: ['./reject-claim.component.scss']
})
export class RejectClaimComponent {
  rejectClaimForm!:FormGroup
  enableSave: boolean = true;
  constructor(private fb:FormBuilder,
    public dialogRef: MatDialogRef<FormSubmissionModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; }
  ) { }
ngOnInit(){
  this.initalizeRejectForm()
  this.rejectClaimForm.statusChanges.subscribe((res: any) => {
    if (res === 'VALID') {
      this.enableSave = false
    } else {
      this.enableSave = true

    }
  })
}
initalizeRejectForm(){
this.rejectClaimForm = this.fb.group({
  rejectReason:('')
})
}
  onSubmit() {
    this.dialogRef.close(this.rejectClaimForm.value.rejectReason);
  }
  onCancel() {
    this.dialogRef.close(undefined);
  }
}
