import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './@amc/gaurds/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/claimit/dashboard', pathMatch: 'full' },
  { path: 'login', title: 'claimIt : Login', loadComponent: () => import('./@amc/components/login/login.component') },
  {
    path: 'claimit',
    canActivate: [AuthGuard],
    children: [
      {
        title: 'Dashboard | claimit',
        path: 'dashboard',
        loadComponent: () => import('./@amc/components/dashboard/dashboard.component')
      },
      {
        title: 'viewOrUnclaim | claimit',
        path: 'viewOrUnclaim',
        loadComponent: () => import('./features/components/view-or-unclaim/view-or-unclaim.component')
      },
      {
        title: 'searchAndClaim | claimit',
        path: 'searchAndClaim',
        loadComponent: () => import('./features/components/search-and-claim/search-and-claim.component')
      },
    ]
  },


];
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
