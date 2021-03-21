import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromocionesClienteRoutingModule } from './promocionescliente-routing.module';
import { PromocionesClienteComponent } from './promocionescliente.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ PromocionesClienteComponent ],
  imports: [
    CommonModule,
    PromocionesClienteRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class PromocionesClienteModule { }
