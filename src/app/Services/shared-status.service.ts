import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStatusService {

  constructor() {
    const storedCartData = localStorage.getItem('cartCheckoutResponse');
    try {
      if (storedCartData) {
        const parsedData = JSON.parse(storedCartData);
        this.cartCheckoutResponse.next(parsedData);
        this.elementSubject.next(parsedData);
      }
    } catch (error) {
      // console.error('Error parsing cartCheckoutResponse from localStorage:', error);
      localStorage.removeItem('cartCheckoutResponse');
      this.cartCheckoutResponse.next([]);
      this.elementSubject.next([]);
    }
  }


  private loginStatus = new BehaviorSubject<boolean>(this.IsLoggedIn);
  isLoggedIn$ = this.loginStatus.asObservable();

  setLoginStatus(status: boolean): void {
    this.loginStatus.next(status);
  }

  get IsLoggedIn(): boolean {
    try {
      const token = localStorage.getItem("token");
      return !!token;
    } catch (error) {
      // console.error('Error checking login status:', error);
      return false;
    }
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

   saveCartData(data: any[]): void {
    localStorage.setItem('cartCheckoutResponse', JSON.stringify(data));
  }

  private getStoredCartData(): any[] {
    const storedData = localStorage.getItem('cartCheckoutResponse');
    try {
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      // console.error('Error parsing cartCheckoutResponse from localStorage:', error);
      localStorage.removeItem('cartCheckoutResponse');
      return [];
    }
  }

  private clearStoredCartData(): void {
    localStorage.removeItem('cartCheckoutResponse');
  }



  private patientId = new BehaviorSubject<any>(this.getStoredPatientId());
  public patientId$ = this.patientId.asObservable();

  sendPatientId(element: any): void {
    this.patientId.next(element);
    this.savePatientId(element);
  }

  private savePatientId(data: any): void {
    localStorage.setItem('patientId', JSON.stringify(data));
  }

  private getStoredPatientId(): any {
    const storedData = localStorage.getItem('patientId');
    if (storedData) {
      try {
        return JSON.parse(storedData); // Safely parse JSON
      } catch (error) {
        // console.error('Error parsing patientId from localStorage:', error);
        localStorage.removeItem('patientId'); // Clear corrupted data
        return null;
      }
    } else {
      // console.log('No patientId found in localStorage.');
      return null;
    }
  }







  private subtotal = new BehaviorSubject<any>(this.getSubtotal());
  public subtotal$ = this.patientId.asObservable();

  sendSubtotal(element: any): void {
    this.patientId.next(element);
    this.saveSubtotal(element);
  }

  private saveSubtotal(data: any): void {
    localStorage.setItem('saveSubtotal', JSON.stringify(data));
  }

  private getSubtotal(): any {
    const storedData = localStorage.getItem('saveSubtotal');
    if (storedData) {
      try {
        return JSON.parse(storedData); // Safely parse JSON
      } catch (error) {
        // console.error('Error parsing patientId from localStorage:', error);
        localStorage.removeItem('saveSubtotal'); // Clear corrupted data
        return null;
      }
    } else {
      // console.log('No patientId found in localStorage.');
      return null;
    }
  }



  private patient = new BehaviorSubject<any>(null);
  public patient$ = this.patient.asObservable();

  sendPatient(data: any): void {
    this.patient.next(data);
  }


}
