import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from "@angular/material/divider";
import { FormSubmissionModalComponent } from 'src/app/@amc/components/form-submission-modal/form-submission-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organization-dialog',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatSelectModule, FormsModule,MatCardModule, NgxDropzoneModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.scss'],
})
export class OrganizationDialogComponent {
  organizationList: any[] = [];
  isOrganizationSelected: boolean = false;
  files: { file: File, preview: string }[] = [];
  selectedLocation!: string;
  latitude: number | null = null;
  longitude: number | null = null;
  selectedOrgId: string = 'Miracle';
  selected: any;
  isMobileScreen: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrganizationDialogComponent>,
    private service: ClaimitService,
    private matDialog: MatDialog,
  ) {
    this.organizationList = data.organizationList;
    console.log(this.organizationList);
    
    if (this.organizationList.length > 0) {
      this.selected = this.organizationList[0].orgId;      
      this.selectedOrgId = this.selected; 
      console.log(this.selectedOrgId);   
    }
    this.onUploadImage();
    
  }
  ngOnInit(): void {
    this.checkScreenSize();
  }
  onOrganizationSelect(orgId: string): void {
    this.selectedOrgId = orgId;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }
  private checkScreenSize(): void {
    this.isMobileScreen = window.innerWidth <= 768; // Adjust breakpoint as needed
  }
  onSelectFile(event: any): void {
    const allowedTypes = ['image/jpeg','image/png', 'image/gif', 'image/bmp', 'image/jfif'];
    this.files = [];   
    let validFiles = true;
    for (const file of event.addedFiles) {
      if (allowedTypes.includes(file.type)) {
        this.files.push({
          file: file,
          preview: URL.createObjectURL(file),  
        });
      } else {
        validFiles = false;
        const dialogRef = this.matDialog.open(FormSubmissionModalComponent, {
          width: "500px",
          data: {
            status: 'Error',
            msg: 'Only JPG, JPEG, PNG, GIF, BMP, and JFIF image formats are allowed.',
            btnName: "OK",
          },
        });
  
        dialogRef.afterClosed().subscribe(() => {
        });
        console.error('Invalid file type:', file.type);
        break;
      }
    }
  
    // If no valid files were found, reset files
    if (!validFiles) {
      this.files = [];
    }
  }
  
  // onLocationChange(): void {
  //   switch (this.selectedLocation) {
  //     case 'Miracle City':
  //       this.latitude = 17.739707548305788;
  //       this.longitude = 83.3433213167522;
  //       break;
  //     case 'Miracle Valley': 
  //       this.latitude = 17.814901263799708;
  //       this.longitude =  83.39172982091242;
  //       break;
  //     case 'Miracle Heights': 
  //       this.latitude = 17.809998290809897;
  //       this.longitude =  83.39687966178053; 
  //       break;
  //     case 'Miracle Global HQ':
  //       this.latitude = 42.48540914670753;
  //       this.longitude = -83.49780041745922;
  //       break;
  //     default:
  //       this.latitude = null;
  //       this.longitude = null;
  //   }
  // }
  

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
          
         
          this.dialogRef.close();  
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.warn('No file selected for upload.');
    }
    
  }
  submit(): void {
    if (this.files.length > 0 && this.selectedOrgId) {
      const formData = new FormData();
      formData.append('image', this.files[0].file);
      // formData.append('orgId', this.selectedOrgId);
  
      this.service.adminUploadItem(this.selectedOrgId, formData).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
          this.isOrganizationSelected = false;
          this.files = [];
          this.dialogRef.close();  
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.warn('No file selected for upload.');
    }
  }

  onCloseDialog() {
    this.dialogRef.close('no');
  }
  
 
}
