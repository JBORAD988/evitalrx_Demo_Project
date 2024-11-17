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


}
