import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router:Router) { }

  routeThePage(page:string) {
    if (page === 'home') {
      this.router.navigate(['/home']);
    } else if (page === 'order') {
      this.router.navigate(['/order']);
    } else if (page === 'login') {
      this.router.navigate(['/auth/login']);
    } else if (page === 'signup') {
      this.router.navigate(['/auth/signup']);
    } else {
      console.error('Invalid route:', page);
    }
  }

}
