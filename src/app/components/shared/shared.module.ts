import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { MaterialModule } from 'src/app/modules/material/material.module';
import { MatMenuModule } from '@angular/material/menu';




@NgModule({
  declarations: [HeaderComponent, FooterComponent, NavigationMenuComponent],
  imports: [CommonModule, MaterialModule, MatMenuModule],
  exports: [HeaderComponent, FooterComponent, NavigationMenuComponent],
})
export class SharedModule { }
