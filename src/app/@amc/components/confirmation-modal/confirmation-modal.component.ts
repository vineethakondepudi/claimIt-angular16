import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { FormSubmissionModalComponent } from "../form-submission-modal/form-submission-modal.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-confirmation-modal",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: "./confirmation-modal.component.html",
  styleUrls: ["./confirmation-modal.component.scss"],
})
export class ConfirmationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<FormSubmissionModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; message: string; hideActions: boolean }
  ) {}
  hideActions: boolean = this.data.hideActions;
  onSubmit() {
    if(this.data.title === 'Delete') {
      this.dialogRef.close('Delete');
    } else if(this.data.title === "Bulk Approve"){
      this.dialogRef.close('Approve');
    } else if(this.data.title === "Info!"){
      this.dialogRef.close('Close');
    }
     else {
      this.dialogRef.close();
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
