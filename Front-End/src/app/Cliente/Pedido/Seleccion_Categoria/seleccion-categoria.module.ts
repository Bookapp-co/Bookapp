import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeleccionCategoriaRoutingModule } from './seleccion-categoria-routing.module';
import { SeleccionCategoriaComponent } from './seleccion-categoria.component';
import { SharedModule } from '../../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ SeleccionCategoriaComponent ],
  imports: [
    CommonModule,
    SeleccionCategoriaRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class SeleccionCategoriaModule { }
