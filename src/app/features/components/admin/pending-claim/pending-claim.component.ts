import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
@Component({
  selector: 'app-pending-claim',
  standalone: true,
  imports: [CommonModule,LoaderComponent,MatIconModule,RouterModule,FormFooterComponent],
  templateUrl: './pending-claim.component.html',
  styleUrls: ['./pending-claim.component.scss'],
})
export default class PendingClaimComponent {
  pendingClaims: any[] = [];
  notifications: any[] = []; // Holds the notification data
  loader:boolean=true;
  constructor(private claimService: ClaimitService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.pendingClaims = this.claimService.getClaims();
    this.loadNotifications(); // Call the function to fetch notifications
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  loadNotifications() {
    this.claimService.getNotifications().subscribe(
      (res: any) => {
        if (res && res.data) {
          this.notifications = res.data; 
          const unreadNotifications = this.notifications.filter(notification => !notification.read);
          const unreadCount = unreadNotifications.length;
          this.claimService.setNotificationCount(unreadCount);
          this.loader = false;
        }
      },
      (error) => {
        this.loader = false;
        console.error('Error fetching notifications:', error);
      }
    );
  }
  
  markAsRead(notificationId: any) {
    const reqbody={
      "id": notificationId,
      "isRead": true
  }
    this.claimService.updateNotification(reqbody).subscribe(
      (res: any) => {
        if(res){
          this.loadNotifications()
        }else{
        }
      })
  }
}
