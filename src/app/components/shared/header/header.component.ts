import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { SharedStatusService } from '../../../Services/shared-status.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  isLoggedIn : Boolean = false;

  cartItemsCount:string = '2';

  constructor(private router:Router,private SharedStatusService: SharedStatusService) { }

  ngOnInit(): void {
    this.SharedStatusService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

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
    console.log('Logged Out Successfully! ')
    this.router.navigate(['/auth/login']);

  }

}
