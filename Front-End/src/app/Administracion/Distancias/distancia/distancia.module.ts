import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistanciaRoutingModule } from './distancia-routing.module';
import { DistanciaComponent } from './distancia.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ DistanciaComponent ],
  imports: [
    CommonModule,
    DistanciaRoutingModule,
    SharedModule
  ]
})
export class DistanciaModule { }
