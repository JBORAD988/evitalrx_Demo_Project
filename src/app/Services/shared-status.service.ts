import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStatusService {

  constructor() {
  }

  private loginStatus = new BehaviorSubject<boolean>(this.IsLoggedIn);
  isLoggedIn$ = this.loginStatus.asObservable();

  setLoginStatus(status: boolean): void {
    this.loginStatus.next(status);
  }



  get IsLoggedIn() {
    if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  }

  private elementSubject = new BehaviorSubject<any>(null);
  public elementSubject$ = this.elementSubject.asObservable();

  sendElement(element: any): void {
    this.elementSubject.next(element);
  }

  ClearCart() {
    this.elementSubject.next(null);

  }


  private cartCheckoutResponse = new BehaviorSubject<any[]>([]);
  public cartCheckoutResponse$ = this.cartCheckoutResponse.asObservable();

  sendCartCheckoutResponse(response: any[]): void {
    this.cartCheckoutResponse.next(response);
  }

  clearCartCheckoutResponse() {
    this.cartCheckoutResponse.next([]);
  }





}
