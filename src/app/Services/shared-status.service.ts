import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStatusService {

  constructor() {
    const storedCartData = localStorage.getItem('cartCheckoutResponse');
    if (storedCartData) {
      this.cartCheckoutResponse.next(JSON.parse(storedCartData));
      this.elementSubject.next(JSON.parse(storedCartData));
    }


  }

  private loginStatus = new BehaviorSubject<boolean>(this.IsLoggedIn);
  isLoggedIn$ = this.loginStatus.asObservable();

  setLoginStatus(status: boolean): void {
    this.loginStatus.next(status);
  }

  get IsLoggedIn() {
    return localStorage.getItem("token") !== null;
  }

  private elementSubject = new BehaviorSubject<any>(null);
  public elementSubject$ = this.elementSubject.asObservable();

  sendElement(element: any): void {
    this.elementSubject.next(element);
    this.saveCartData(element);
  }

  ClearCart() {
    this.elementSubject.next(null);
    this.clearStoredCartData();
  }

  private cartCheckoutResponse = new BehaviorSubject<any[]>(this.getStoredCartData());
  public cartCheckoutResponse$ = this.cartCheckoutResponse.asObservable();

  sendCartCheckoutResponse(response: any[]): void {
    this.cartCheckoutResponse.next(response);
    this.saveCartData(response);
  }

  clearCartCheckoutResponse() {
    this.cartCheckoutResponse.next([]);
    this.clearStoredCartData();
  }

  private saveCartData(data: any[]): void {
    localStorage.setItem('cartCheckoutResponse', JSON.stringify(data));
  }

  private getStoredCartData(): any[] {
    const storedData = localStorage.getItem('cartCheckoutResponse');
    return storedData ? JSON.parse(storedData) : [];
  }

  private clearStoredCartData(): void {
    localStorage.removeItem('cartCheckoutResponse');
  }
}
