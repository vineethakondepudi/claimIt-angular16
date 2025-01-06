import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-claim-confirmation-dialog',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-semibold text-green-600">Success</h1>
        <button mat-icon-button (click)="onClose()" >
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="my-4">
        <p class="text-gray-700">Your claim request has been submitted successfully.</p>
      </div>
            <div class="flex justify-end space-x-4">
        <button mat-button (click)="onCancel()" class="text-gray-600">Cancel</button>
        <button mat-button (click)="onOk()" class="text-white bg-[#219C90] hover:bg-[#1A7C6A] rounded-lg px-4 py-2">OK</button>
      </div>
    </div>
  `,
  styleUrls: ['./claim-confirmation-dialog.component.scss']
})
export class ClaimConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<ClaimConfirmationDialogComponent>) {}

 
  onCancel(): void {
    this.dialogRef.close('cancel');
  }


  onOk(): void {
    this.dialogRef.close('ok');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
