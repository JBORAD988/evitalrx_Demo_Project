import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddtocartComponent } from './addtocart/addtocart.component';
import { CheckoutGuard } from 'src/app/guard/checkout.guard';
import { OrderconfirmationComponent } from './orderconfirmation/orderconfirmation.component';

const routes: Routes = [{ path: 'order', component: OrdersComponent },{
  path: 'dashboard', component: DashboardComponent
},{path:'checkout',component:CheckoutComponent , canActivate: [CheckoutGuard]},{path:'addtocart',component:AddtocartComponent},
{path:'orderConfirmation',component:OrderconfirmationComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
