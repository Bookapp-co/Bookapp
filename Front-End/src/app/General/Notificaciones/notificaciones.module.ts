import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacionesRoutingModule } from './notificaciones-routing.module';
import { NotificacionesComponent } from './notificaciones.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ NotificacionesComponent ],
  imports: [
    CommonModule,
    NotificacionesRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class NotificacionesModule { }
