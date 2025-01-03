import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimitService } from '../../sharedServices/claimit.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-claim-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDatepickerModule, MatFormFieldModule],
  templateUrl: './claim-request.component.html',
  styleUrls: ['./claim-request.component.scss']
})
export default class ClaimRequestComponent {
  
  claimData = {
    name: '',
    contact: '',
    email: '',
    itemType: '',
    location: '',
    identification: '',
    additionalInfo: '',
    incidentDate: '', 
  };

  constructor(private claimService: ClaimitService, private router: Router ) {}

  onSubmit() {
    this.claimService.addClaim({ ...this.claimData });
    alert('Your claim request has been submitted successfully.');
    this.resetForm();
  }
  onCancel() {
    
    this.router.navigate(['/claimit/dashboard']);
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
    };
  }
}
