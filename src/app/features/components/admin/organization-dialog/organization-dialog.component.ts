import { Component, HostListener, Inject, ViewChild } from '@angular/core';
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
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-organization-dialog',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatSelectModule,MatStepperModule, FormsModule,MatCardModule, NgxDropzoneModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './organization-dialog.component.html',
  styleUrls: ['./organization-dialog.component.scss'],
})
export class OrganizationDialogComponent {
  @ViewChild(MatStepper) stepper!: MatStepper;
  organizationList: any[] = [];
  isOrganizationSelected: boolean = false;
  files: { file: File, preview: string }[] = [];
  selectedLocation!: string;
  latitude: number | null = null;
  longitude: number | null = null;
  selectedOrgId: string = 'Miracle';
  selected: any;
  step1Form!: FormGroup;
  step2Form!: FormGroup;
  isMobileScreen: boolean = false;
  uploaddata: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrganizationDialogComponent>,
    private service: ClaimitService,
    private matDialog: MatDialog,  private fb: FormBuilder,
  ) {
    this.organizationList = data.organizationList;
    
    if (this.organizationList.length > 0) {
      this.selected = this.organizationList[0].orgId;      
      this.selectedOrgId = this.selected; 
    }
    this.onUploadImage();
    
  }
  ngOnInit(): void {
    this.checkScreenSize();
    this.step1Form = this.fb.group({
      image: ['', Validators.required]
    });

    this.step2Form = this.fb.group({
      preview: ['', Validators.required]
    });
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
  
  

  onRemove(file: any): void {
    this.files = this.files.filter(f => f !== file);
  }

  onUploadImage(): void {
    this.files = [];
    if (this.files.length > 0 && this.selectedOrgId) {
      const formData = new FormData();
      formData.append('image', this.files[0].file);
      formData.append('orgId', this.selectedOrgId);
  
      this.service.adminUploadItem(this.selectedOrgId, formData).subscribe(
        (response) => {
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
  // submit(): void {
  //   if (this.files.length > 0 && this.selectedOrgId) {
  //     const formData = new FormData();
  //     formData.append('image', this.files[0].file);
  //     // formData.append('orgId', this.selectedOrgId);
  
  //     this.service.adminUploadItem(this.selectedOrgId, formData).subscribe(
  //       (response) => {
  //         this.isOrganizationSelected = false;
  //         this.files = [];
  //         this.dialogRef.close();  
  //       },
  //       (error) => {
  //         console.error('Error uploading file:', error);
  //       }
  //     );
  //   } else {
  //     console.warn('No file selected for upload.');
  //   }
  // }
  submit(): void {
    if (this.files.length > 0 && this.selectedOrgId) {
      const formData = new FormData();
      formData.append('image', this.files[0].file);
      formData.append('orgId', this.selectedOrgId);

      this.service.adminUploadItem(this.selectedOrgId, formData).subscribe(
        (response) => {
          // this.files = [];
          // this.dialogRef.close();
          this.uploaddata= response.description
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
    this.dialogRef.close();
  }
  
 
}
