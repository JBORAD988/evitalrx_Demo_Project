import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SharedStatusService } from '../../../Services/shared-status.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, filter, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements AfterViewInit, OnInit {

  isLoggedIn : Boolean = false;

  cartItemsCount:string = '';

  constructor(private router:Router,private SharedStatusService: SharedStatusService, private toastr: ToastrService) {

   }

  ngOnInit(): void {
    this.SharedStatusService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.SharedStatusService.elementSubject$.subscribe((element:any) => {
      if (Array.isArray(element)) {
        this.cartItemsCount = element.length.toString();
      } else {
        console.warn('Expected an array from elementSubject$, got:', element);
        this.cartItemsCount = '';
      }
    });



  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateToolbarPosition(), 0);
  }

  routeThePage(page:string) {
    if (page === 'home') {
      this.router.navigate(['/pages/dashboard']);
    } else if (page === 'order') {
      this.router.navigate(['/pages/order']);
    } else if (page === 'login') {
      this.router.navigate(['/auth/login']);
    } else if (page === 'signup') {
      this.router.navigate(['/auth/signup']);
    }else if (page === 'cart') {
      this.router.navigate(['/pages/addtocart']);
    }
    else {
      console.error('Invalid route:', page);
    }
  }

  logout(){
    this.SharedStatusService.setLoginStatus(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Logged Out Successfully! ')
    this.toastr.warning('Logged Out!');
    this.router.navigate(['/auth/login']);

  }



  updateToolbarPosition(): void {
    const headerElement = document.querySelector('.mat-toolbar.mat-primary') as HTMLElement;

    if (!headerElement) {
      console.error('Element with class "mat-toolbar.mat-primary" not found.');
      return;
    }

    if (!this.isLoggedIn) {
      headerElement.style.position = 'absolute';

      console.log('Header is absolute');

    } else {
      headerElement.style.position = 'sticky';
      console.log('Header is not absolute');
    }
  }


}
