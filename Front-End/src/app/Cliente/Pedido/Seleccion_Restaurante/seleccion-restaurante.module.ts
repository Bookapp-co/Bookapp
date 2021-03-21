import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeleccionRestauranteRoutingModule } from './seleccion-restaurante-routing.module';
import { SeleccionRestauranteComponent } from './seleccion-restaurante.component';
import { SharedModule } from '../../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ SeleccionRestauranteComponent ],
  imports: [
    CommonModule,
    SeleccionRestauranteRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class SeleccionRestauranteModule { }
