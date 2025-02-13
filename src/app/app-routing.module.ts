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
        title:'About | ClaimIT',
        path:'about',
        loadComponent:()=>import('./@amc/components/about/about.component')
      },
      {
        title:'About | ClaimIT',
        path:'contact',
        loadComponent:()=>import('./@amc/components/contact/contact.component')
      },
      {
        title:'About | ClaimIT',
        path:'help',
        loadComponent:()=>import('./@amc/components/help-center/help-center.component')
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
      {
        title: 'claimRequest | claimit',
        path: 'claimRequest',
        loadComponent: () => import('./features/components/claim-request/claim-request.component')
      },
      {
        title: 'addItem | claimit',
        path: 'addItem',
        loadComponent: () => import('./features/components/admin/additem/additem.component')
      },
      {
        title: 'removeOrArchive | claimit',
        path: 'removeOrArchive',
        loadComponent: () => import('./features/components/admin/remove-or-archive/remove-or-archive.component')
      },
      {
        title:'admin search | claimit',
        path:'search',
        loadComponent:()=> import('./features/components/admin/admin-search/admin-search.component')
      },
      {
        title:'pending claim | claimit',
        path:'pendingClaim',
        loadComponent:()=> import('./features/components/admin/pending-claim/pending-claim.component')
      },
      {
        title: 'category Management | claimit',
        path: 'category',
        loadComponent: () => import('./features/components/category-management/category-management.component').then(m => m.CategoryManagementComponent)
      },
      {
        title: 'Expired Items | claimit',
        path: 'expiredItems',
        loadComponent: () => import('./features/components/admin/expired-items/expired-items.component').then(m => m.ExpiredItemsComponent)
      }
    ]
  },


];
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
