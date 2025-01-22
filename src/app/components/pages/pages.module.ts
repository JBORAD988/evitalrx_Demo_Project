import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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
import { OrderconfirmationComponent } from './orderconfirmation/orderconfirmation.component';
import { ManageexpenceComponent } from './manageexpence/manageexpence.component';
import { IndianCurrencyFormatPipe } from 'src/app/pipes/indian-currency-format.pipe';





@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    OrdersComponent,
    AddtocartComponent,
    CheckoutComponent,
    OrderconfirmationComponent,
    ManageexpenceComponent,
    IndianCurrencyFormatPipe


  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    DatePipe

  ]
})
export class PagesModule { }
