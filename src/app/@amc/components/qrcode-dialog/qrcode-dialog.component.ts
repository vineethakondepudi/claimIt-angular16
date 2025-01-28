import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
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
  @ViewChild('qrCode') qrCode!: QRCodeComponent;
  // @ViewChild('qrCode', { static: false, read: ElementRef }) qrCode!: ElementRef;
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
  onSaveQrCode(): void {
    const canvas = this.qrCode.qrcElement.nativeElement.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const combinedCanvas = document.createElement('canvas');
      const context = combinedCanvas.getContext('2d');
      if (!context) {
        console.error('Could not get 2D context for canvas.');
        return;
      }
      const qrCodeSize = 200; 
      const padding = 20; 
      const idHeight = 30; 
      combinedCanvas.width = qrCodeSize + 2 * padding;
      combinedCanvas.height = qrCodeSize + 2 * padding + idHeight;
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
      context.fillStyle = '#000000';
      context.font = '16px Arial';
      context.textAlign = 'center';
      context.fillText(`ID: ${this.data.requiredData.uniqueId}`, combinedCanvas.width / 2, idHeight - 10);
      context.drawImage(canvas, padding, idHeight + padding, qrCodeSize, qrCodeSize);
      const combinedImage = combinedCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = combinedImage;
      link.download = `qr-code-with-id-${this.data.requiredData.uniqueId}.png`;
      link.click();
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              img {
                max-width: 100%;
                max-height: 100%;
              }
            </style>
          </head>
          <body>
            <img src="${combinedImage}" alt="QR Code with ID">
          </body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.print();
      printWindow?.close();
    } else {
      console.error('QR code canvas not found.');
    }
  }


  onCancel() {
    this.dialogRef.close('no');
  }
}
