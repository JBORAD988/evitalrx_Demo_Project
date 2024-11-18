import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [{ path: 'order', component: OrdersComponent },{
  path: 'dashboard', component: DashboardComponent
},{path:'checkout',component:CheckoutComponent},{path:'addtocart',component:CheckoutComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
