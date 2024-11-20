import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedStatusService } from '../Services/shared-status.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGuard implements CanActivate {
  constructor(private router: Router , private sharedData : SharedStatusService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const cartCheckoutResponse = this.sharedData.cartCheckoutResponse$.subscribe((element) => {
      return element;
    });

    if (cartCheckoutResponse) {
      return true;
    } else {
       this.router.navigate(['/pages/checkout']);
       return false;
    }
  }
}
