import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimitService } from '../../sharedServices/claimit.service';


@Component({
  selector: 'app-claim-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claim-request.component.html',
  styleUrls: ['./claim-request.component.scss']
})
export default class ClaimRequestComponent {
  claimData = {
    name: '',
    contact: '',
    location: '',
    identification: '',
  };

  constructor(private claimService: ClaimitService ) {}

  onSubmit() {
    this.claimService.addClaim({ ...this.claimData });
    alert('Your claim request has been submitted successfully.');
    this.resetForm();
  }

  resetForm() {
    this.claimData = {
      name: '',
      contact: '',
      location: '',
      identification: '',
    };
  }
}
