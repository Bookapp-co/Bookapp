import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRestauranteRoutingModule } from './perfil-restaurante-routing.module';
import { PerfilRestauranteComponent } from './perfil-restaurante.component';
import { SharedModule } from '../../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ PerfilRestauranteComponent ],
  imports: [
    CommonModule,
    PerfilRestauranteRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class PerfilRestauranteModule { }
