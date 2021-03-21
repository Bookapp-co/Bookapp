import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

console.log("App Analytics Module Entered3");

@NgModule({
  declarations: [ RegistroComponent ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class RegistroModule { }
