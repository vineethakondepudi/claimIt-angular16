import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { APP_NAME, OWNER_NAME } from '../../constants/application.details';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { BreakpointObserver,Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSelectModule,
    CommonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    RouterModule,
    CommonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatTooltipModule,],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  customerName = OWNER_NAME
  applicationName = APP_NAME
  @Input() hideMenu: boolean | undefined;
  authSuccess: boolean = true;
  showReports: boolean = false;
  opened: boolean = true;
  param: any;
  notificationCount = 0;
  userRole: string | null = '';
  menuItems: any[] = [];
  isMobile = false;
  tabRoutes: { route: string, icon: string, label: string, isNotification?: boolean; }[] = [];

  constructor(public router: Router, private route: ActivatedRoute,private service:ClaimitService,private breakpointObserver: BreakpointObserver) {
    this.service.loginResponse_Triggered.subscribe((res:any)=>{
      this.userRole = localStorage.getItem('role');
      this.getMenuItems()
      this.setTabRoutes()
    })
    this.route.queryParamMap.subscribe((params) => {
      this.param = params.get('type');
    });
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }
  ngOnInit() {
    this.service.notificationCount$.subscribe((count) => {
      this.notificationCount = count;
      this.updateNotificationLabel();
    });
       this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  
    // this.service.pendingClaimsCount$.subscribe((count) => {
    //   this.notificationCount = count;
    //   this.updateNotificationLabel();
    // });
  }

  @HostListener('window:resize', ['$event'])
  openedMenu(event: Event) {
    this.opened = window.innerWidth >= 800;
  }

  openMenu() {
    this.opened = !this.opened;
  }

 
 // Set the tab routes based on user role
 setTabRoutes() {
  if (this.userRole === 'admin') {
    this.tabRoutes = [
      { route: '/claimit/searchAndClaim', icon: 'search_outline', label: 'Search and Claim' },
      { route: '/claimit/about', icon: 'info_outline', label: 'About' },
      { route: '/claimit/pendingClaim', icon: 'notifications_none', label: 'Notifications' },
      { route: '/claimit/help', icon: 'help_outline', label: 'Help' },
    ];
  } else {
    this.tabRoutes = [
      { route: '/claimit/searchAndClaim', icon: 'search_outline', label: 'Search and Claim' },
      { route: '/claimit/about', icon: 'info_outline', label: 'About' },
      { route: '/claimit/contact', icon: 'contacts_outline', label: 'Contact Us' },
      { route: '/claimit/help', icon: 'help_outline', label: 'Help' },
    ];
  }
}

public isTabActive(tab: string): boolean {
  const currentUrl = this.router.url;
  return currentUrl === tab; // Exact match check
}
  getMenuItems() {
    if (this.userRole === 'admin') {
     this.menuItems = [
        { label: 'Dashboard', icon: 'home', route: '/claimit/dashboard' },
        { label: 'Add Item', icon: 'add_circle', route: '/claimit/addItem' },
        { label: 'Approve / Reject Claim', icon: 'rule', route: '/claimit/search' },
        { label: 'category Management', icon: 'visibility', route: '/claimit/category' },
        // { label: 'Notifications', icon: 'notifications', route: '/claimit/pendingClaim', isNotification: true },
      ];
    } else {
      this.menuItems = [
        { label: 'Home', icon: 'home', route: '/claimit/dashboard' },
        { label: 'Search And Claim', icon: 'search', route: '/claimit/searchAndClaim' },

      ];
    }

  }
  updateNotificationLabel() {
    const notificationsTab = this.tabRoutes.find((item) => item.label.startsWith('Notifications'));
    if (notificationsTab) {
      notificationsTab.label = `Notifications (${this.notificationCount})`;
    }
  }
  resetNotificationCount() {
    this.router.navigateByUrl('/claimit/pendingClaim')
    if (this.notificationCount > 0) {
      this.notificationCount = 0;
      this.updateNotificationLabel();
    }
  }
  logout() {
    localStorage.removeItem('role')
    this.router.navigateByUrl('/login')
  }


  onStorageChange(event: StorageEvent) {
    if (event.key === 'role') {
      this.getMenuItems(); 
    }
  }
}