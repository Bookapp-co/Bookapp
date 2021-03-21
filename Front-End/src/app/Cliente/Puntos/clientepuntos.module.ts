import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientePuntosRoutingModule } from './clientepuntos-routing.module';
import { ClientePuntosComponent } from './clientepuntos.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ ClientePuntosComponent ],
  imports: [
    CommonModule,
    ClientePuntosRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class ClientePuntosModule { }
