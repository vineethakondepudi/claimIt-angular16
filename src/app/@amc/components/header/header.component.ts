import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
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

  constructor(public router: Router, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((params) => {
      this.param = params.get('type')
    });
  }
  @HostListener('window:resize', ['$event'])
  openedMenu(event: Event) {
    this.opened = window.innerWidth >= 800;
  }
  openMenu() {
    this.opened = !this.opened
  }

  public isTabActive(tab: string): boolean {
    const currentUrl = this.router.url;
  
    const tabRoutes: { [key: string]: string[] } = {
      supervisor: ['/claimit/searchAndClaim','/claimit/searchAndClaim'],
    };
  
    if (tabRoutes[tab]) {
      return tabRoutes[tab].some(route => currentUrl.startsWith(route));
    }
    return currentUrl === `/claimit/${tab}`;
  }
  logout() {
    localStorage.removeItem('isLogin')
    this.router.navigateByUrl('/login')
  }
}
