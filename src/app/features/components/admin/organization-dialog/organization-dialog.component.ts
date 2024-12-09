import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-organization-dialog',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatSelectModule, MatCardModule, NgxDropzoneModule, MatIconModule],
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.scss'],
})
export class OrganizationDialogComponent {
  organizationList: any[] = [];
  isOrganizationSelected: boolean = false;
  files: any[] = [];
  selectedOrgId: string = '';
  selected: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrganizationDialogComponent>,
    private service: ClaimitService
  ) {
    this.organizationList = data.organizationList;
  }

  onOrganizationSelect(orgId: string): void {
    this.selectedOrgId = orgId;
  }

  onSelectFile(event: any): void {
    this.files = [];
    for (const file of event.addedFiles) {
      this.files.push({
        file: file,
        preview: URL.createObjectURL(file),
      });
    }
  }

  onRemove(file: any): void {
    this.files = this.files.filter(f => f !== file);
  }

  onUploadImage(): void {
    if (this.files.length > 0 && this.selectedOrgId) {
      const formData = new FormData();
      formData.append('image', this.files[0].file);
      formData.append('orgId', this.selectedOrgId);
  
      this.service.adminUploadItem(this.selectedOrgId, formData).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
          this.isOrganizationSelected = false;
          this.files = [];
          
          // Close the dialog after successful upload
          this.dialogRef.close();  // This will close the dialog
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.warn('No file selected for upload.');
    }
  }
  
}
