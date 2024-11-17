import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    OrdersComponent,

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class PagesModule { }
