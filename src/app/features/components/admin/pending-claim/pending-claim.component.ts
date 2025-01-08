import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';

@Component({
  selector: 'app-pending-claim',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-claim.component.html',
  styleUrls: ['./pending-claim.component.scss']
})
export default class PendingClaimComponent {
  pendingClaims: any[] = [];
  constructor(private claimService: ClaimitService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.pendingClaims = this.claimService.getClaims();
  }

  ngAfterViewChecked() {
    
    this.cdr.detectChanges();
  }
}
