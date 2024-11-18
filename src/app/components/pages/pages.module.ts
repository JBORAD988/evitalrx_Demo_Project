import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddtocartComponent } from './addtocart/addtocart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ToastrModule } from 'ngx-toastr';





@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    OrdersComponent,
    AddtocartComponent,
    CheckoutComponent,


  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PagesModule { }
