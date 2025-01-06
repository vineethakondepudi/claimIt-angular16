import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimitService } from '../../sharedServices/claimit.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ClaimConfirmationDialogComponent } from '../claim-confirmation-dialog/claim-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-claim-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, 
    MatSelectModule, MatDialogModule],
  templateUrl: './claim-request.component.html',
  styleUrls: ['./claim-request.component.scss']
})
export default class ClaimRequestComponent implements OnInit {
  selectedLocation!: string;
  categories: any[] = [];
  latitude: number | null = null;
  longitude: number | null = null;
  selectedFile: File | null = null; 
  claimData = {
    name: '',
    contact: '',
    email: '',
    itemType: '',
    location: '',
    identification: '',
    additionalInfo: '',
    incidentDate: '', 
    imageUrl:''
  };

  constructor(private claimService: ClaimitService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(){
    this.claimService.getCategories().subscribe((data: any) => {
      this.categories = data;
      console.log(this.categories,41); 
    });
  }

  onSubmit() {
    this.claimService.addClaim({ ...this.claimData });
    this.dialog.open(ClaimConfirmationDialogComponent);
    this.resetForm();
  }
  onCancel() {
    
    this.router.navigate(['/claimit/dashboard']);
  }
  filterDates = (date: Date | null): boolean => {
    const today = new Date();
    return date ? date <= today : false;
  };


  onLocationChange(): void {
    switch (this.selectedLocation) {
      case 'Miracle City':
        this.latitude = 17.739707548305788;
        this.longitude = 83.3433213167522;
        break;
      case 'Miracle Valley': 
        this.latitude = 17.814901263799708;
        this.longitude =  83.39172982091242;
        break;
      case 'Miracle Heights': 
        this.latitude = 17.809998290809897;
        this.longitude =  83.39687966178053; 
        break;
      case 'Miracle Global HQ':
        this.latitude = 42.48540914670753;
        this.longitude = -83.49780041745922;
        break;
      default:
        this.latitude = null;
        this.longitude = null;
    }
  }
  onFileSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.claimData.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  resetForm() {
    this.claimData = {
      name: '',
      contact: '',
      email: '',
      itemType: '',
      location: '',
      identification: '',
      additionalInfo: '',
      incidentDate: '',    
      imageUrl:'' 
    };
  }
}
