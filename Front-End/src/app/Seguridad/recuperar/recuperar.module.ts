import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecuperarRoutingModule } from './recuperar-routing.module';
import { RecuperarComponent } from './recuperar.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

console.log("App Analytics Module Entered3");

@NgModule({
  declarations: [ RecuperarComponent ],
  imports: [
    CommonModule,
    RecuperarRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class RecuperarModule { }
