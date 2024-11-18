import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormsComponent,
    PatientFormComponent
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    ReactiveFormsModule
  ]
})
export class FormsModule { }
