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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';

@Component({
  selector: 'app-organization-dialog',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatSelectModule,LoaderComponent, MatProgressSpinnerModule,MatStepperModule, FormsModule,MatCardModule, NgxDropzoneModule, MatIconModule, MatButtonModule, MatDividerModule],
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
  uploaddata: string = '';
  isTruncated: boolean = true;
  isLoading: boolean = false;
  formattedData:any;
showFullData: boolean = false;
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
  
  toggleTruncate(): void {
    this.isTruncated = !this.isTruncated;
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
  submit(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.files.length > 0 && this.selectedOrgId) {
        this.isLoading = true; // Start loading
        const formData = new FormData();
        formData.append('image', this.files[0].file);
        formData.append('orgId', this.selectedOrgId);
  
        this.service.adminUploadItem(this.selectedOrgId, formData).subscribe(
          (response) => {
            this.formatResponse(response);
            this.isLoading = false;
            resolve(); // Resolve the promise after successful submission
          },
          (error) => {
            console.error('Error uploading file:', error);
            this.isLoading = false;
            reject(error); // Reject the promise in case of an error
          }
        );
      } else {
        console.warn('No file selected for upload.');
        resolve(); // Resolve immediately if no file is selected
      }
    });
  }
  
  async onNextClick(stepper: MatStepper): Promise<void> {
    try {
      await this.submit(); // Wait for the submit process to complete
      stepper.next(); // Move to the next step
    } catch (error) {
      console.error('Submission failed:', error);
      // Optionally handle errors here (e.g., show a message to the user)
    }
  }
  formatResponse(response: any): void {
    const allowedKeys = ['description', 'title'];
    this.formattedData = Object.entries(response)
      .filter(([key]) => allowedKeys.includes(key))
      .map(([key, value]) => ({ key, value }));
  }
  toggleReadMore(): void {
    this.showFullData = !this.showFullData;
  }
  onCloseDialog() {
    this.dialogRef.close();
  }
  
 
}
