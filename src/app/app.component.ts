import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { BehaviorSubject, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private isCheckinScreenSubject = new BehaviorSubject<boolean>(false);
  isCheckinScreen$ = this.isCheckinScreenSubject.asObservable();
  private routerSubscription!: Subscription;

  ngOnInit() {
    // Listen for navigation changes and update isCheckinScreenSubject
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isCheckinScreenSubject.next(event.url === '/checkin' || event.url === '/landing' );
      });
  }

  ngOnDestroy() {
    // Clean up the subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
