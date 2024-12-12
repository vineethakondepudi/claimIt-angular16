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
  userRole: string | null = '';
  menuItems: any[] = [];

  constructor(public router: Router, private route: ActivatedRoute,private service:ClaimitService) {
    this.service.loginResponse_Triggered.subscribe((res:any)=>{
      console.log(res)
      this.userRole = localStorage.getItem('role');
      this.getMenuItems()

    })
    this.route.queryParamMap.subscribe((params) => {
      this.param = params.get('type');
    });
    window.addEventListener('storage', this.onStorageChange.bind(this));
  }
  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  openedMenu(event: Event) {
    this.opened = window.innerWidth >= 800;
  }

  openMenu() {
    this.opened = !this.opened;
  }

  public isTabActive(tab: string): boolean {
    const currentUrl = this.router.url;
    const tabRoutes: any =  ['/claimit/searchAndClaim', '/claimit/searchAndClaim','/claimit/about','/claimit/contact','/claimit/help']
    if (tabRoutes[tab]) {
      return tabRoutes[tab].some((route: string) => currentUrl.startsWith(route));
    }
    return currentUrl === tab;
  }

  getMenuItems() {
    // this.userRole = localStorage.getItem('role');
    console.log('menuuuuuu');
    
    if (this.userRole === 'admin') {

     this.menuItems = [
        { label: 'Home', icon: 'home', route: '/claimit/dashboard' },
        { label: 'Add Item', icon: 'add', route: '/claimit/addItem' },
        // { label: 'Remove/Archive Item', icon: 'archive', route: '/claimit/removeOrArchive' },
        { label: 'Search And Claim', icon: 'search', route: '/claimit/search' },
      ];
    } else {
      this.menuItems = [
        { label: 'Home', icon: 'home', route: '/claimit/dashboard' },
        { label: 'Search And Claim', icon: 'search', route: '/claimit/searchAndClaim' },
        { label: 'View/Unclaim', icon: 'visibility', route: '/claimit/viewOrUnclaim' },
      ];
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