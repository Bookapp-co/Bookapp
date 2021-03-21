import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

console.log("App Analytics Module Entered3");

@NgModule({
  declarations: [ InicioComponent ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class InicioModule { }
