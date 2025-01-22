import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './components/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuth, AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AuthApi } from './Api/firebaseApi';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ToastrModule } from 'ngx-toastr';
import { PipesPipe } from './pipes.pipe';
import { IndianCurrencyFormatPipe } from './pipes/indian-currency-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PipesPipe,


  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(AuthApi.firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule,
    AngularFirestoreModule,

    ToastrModule.forRoot( {
      timeOut: 1000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
