import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-qrcode-dialog',
  standalone: true,
  imports: [CommonModule,QRCodeModule,    MatDialogModule,
      MatIconModule,
      MatButtonModule,
      MatDividerModule,],
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})

export class QrcodeDialogComponent {
  requiredData: any;
  title!: string;
  constructor(
      public dialogRef: MatDialogRef<QrcodeDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.requiredData = data.requiredData;
      this.title = data.title;
    }
  generateQrCodeData(element: any): string {
    return JSON.stringify({
      id: element.itemId,
      name: element.name,
    });
  }
  onCancel() {
    this.dialogRef.close('no');
  }
}
