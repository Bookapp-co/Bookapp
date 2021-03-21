import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistanciasRoutingModule } from './distancias-routing.module';
import { DistanciasComponent } from './distancias.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ DistanciasComponent ],
  imports: [
    CommonModule,
    DistanciasRoutingModule,
    SharedModule
  ]
})
export class DistanciasModule { }
