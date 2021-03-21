import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntoRoutingModule } from './punto-routing.module';
import { PuntoComponent } from './punto.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ PuntoComponent ],
  imports: [
    CommonModule,
    PuntoRoutingModule,
    SharedModule
  ]
})
export class PuntoModule { }
