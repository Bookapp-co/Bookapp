import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuSidebarRoutingModule } from './menu-routing.module';
import { MenuSidebarComponent } from './menu.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ MenuSidebarComponent ],
  imports: [
    CommonModule,
    MenuSidebarRoutingModule,
    SharedModule
  ]
})
export class MenuSidebarModule { }
