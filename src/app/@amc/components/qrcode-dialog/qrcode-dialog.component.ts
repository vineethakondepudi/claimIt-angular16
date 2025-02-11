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
    const combinedCanvas = document.createElement('canvas');
    const context = combinedCanvas.getContext('2d');
    if (!context) {
      console.error('Could not get 2D context for canvas.');
      return;
    }

    const qrCodeSize = 200;
    const padding = 20;
    const idHeight = 30;

    // Set canvas size to fit only the ID text
    combinedCanvas.width = qrCodeSize + 2 * padding;
    combinedCanvas.height = idHeight + 2 * padding;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
    context.fillStyle = '#000000';
    context.font = '16px Arial';
    context.textAlign = 'center';

    // Draw only the ID text
    context.fillText(`ID: ${this.data.requiredData.uniqueId}`, combinedCanvas.width / 2, combinedCanvas.height / 2);

    const combinedImage = combinedCanvas.toDataURL('image/png');

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = combinedImage;
    link.download = `id-${this.data.requiredData.uniqueId}.png`;

    // Try to trigger the download on desktop and mobile
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
      // For mobile devices, let's first try opening in a new tab and let the user download manually
      const imageWindow = window.open();
      if (imageWindow) {
        imageWindow.document.write('<img src="' + combinedImage + '" style="width:100%"/>');
        imageWindow.document.close();
        setTimeout(() => {
          imageWindow.location.href = combinedImage; // Force it to open and allow saving
        }, 500);
      }
    } else {
      // For desktop, trigger the download directly as before
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  onCancel() {
    this.dialogRef.close('no');
  }
}
