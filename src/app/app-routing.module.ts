import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';


    const routes: Routes = [
      { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
      { path: 'pages', loadChildren: () => import('./components/pages/pages.module').then(m => m.PagesModule) , canActivate:[authGuard]},
      { path: 'forms', loadChildren: () => import('./components/forms/forms.module').then(m => m.FormsModule) ,canActivate:[authGuard] },
      { path: '', redirectTo: '/pages/dashboard', pathMatch: 'full',},
    ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
