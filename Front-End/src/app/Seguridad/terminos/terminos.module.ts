import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminosRoutingModule } from './terminos-routing.module';
import { TerminosComponent } from './terminos.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

console.log("App Analytics Module Entered3");

@NgModule({
  declarations: [ TerminosComponent ],
  imports: [
    CommonModule,
    TerminosRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class TerminosModule { }
