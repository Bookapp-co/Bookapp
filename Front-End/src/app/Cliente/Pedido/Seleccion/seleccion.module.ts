import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeleccionRoutingModule } from './seleccion-routing.module';
import { SeleccionComponent } from './seleccion.component';
import { SharedModule } from '../../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ SeleccionComponent ],
  imports: [
    CommonModule,
    SeleccionRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class SeleccionModule { }
