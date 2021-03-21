import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferidoRoutingModule } from './referido-routing.module';
import { ReferidoComponent } from './referido.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

console.log("App Analytics Module Entered3");

@NgModule({
  declarations: [ ReferidoComponent ],
  imports: [
    CommonModule,
    ReferidoRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class ReferidoModule { }
