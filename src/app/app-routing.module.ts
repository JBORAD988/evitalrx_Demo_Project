import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';


    const routes: Routes = [
      { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
      { path: 'pages', loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule) , canActivate:[authGuard]},
      { path: 'forms', loadChildren: () => import('./components/forms/forms.module').then(m => m.FormsModule) ,canActivate:[authGuard] },
      { path: '', component:DashboardComponent,canActivate:[authGuard] },
    ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
