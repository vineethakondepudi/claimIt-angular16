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
      id: element.uniqueId,
      name: element.name,
      status: element.status,
       verificationLink:  element.status === "UNCLAIMED" ? `http://localhost:4200/assets/verification.html?itemId=${element.itemId}` : 'Item is Claimed'
    });
  }
  getQrCodeColors(status: string): { colorDark: string; colorLight: string } {
    switch (status) {
      case 'CLAIMED':
        return { colorDark: '#000000', colorLight: '#FFFFFF' }; 
      case 'UNCLAIMED':
        return { colorDark: '#000000', colorLight: '#FFFFFF' }; 
        case 'PENDING_PICKUP':
        return { colorDark: '#000000', colorLight: '#FFFFFF' }; 
        case 'OPEN':
        return { colorDark: '#000000', colorLight: '#FFFFFF' };
        case 'PENDING_APPROVAL':
        return { colorDark: '#000000', colorLight: '#FFFFFF' };  
      default:
        return { colorDark: '#000000', colorLight: '#FFFFFF' }; 
    }
  }
  
  onCancel() {
    this.dialogRef.close('no');
  }
}
