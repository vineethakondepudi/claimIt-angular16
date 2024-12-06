import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
@Component({
  selector: "app-form-submission-modal",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: "./form-submission-modal.component.html",
  styleUrls: ["./form-submission-modal.component.scss"],
})
export class FormSubmissionModalComponent {
  public showButton:boolean=false
  constructor(
    public dialogRef: MatDialogRef<FormSubmissionModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { msg: string; err: string; warn: string; status: string,showbtn: boolean },
    public readonly router: Router
  ) {
    this.showButton=data.showbtn
  }
  onSubmit() {
    this.dialogRef.close('ok');
  }
  onCancel()
  {
    this.dialogRef.close();
  }
}
