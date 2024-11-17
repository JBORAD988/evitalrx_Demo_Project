import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';



@NgModule({
  declarations: [HeaderComponent, FooterComponent, NavigationMenuComponent],
  imports: [CommonModule],
  exports: [HeaderComponent, FooterComponent, NavigationMenuComponent],
})
export class SharedModule { }
