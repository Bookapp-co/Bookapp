import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UbicacionesRoutingModule } from './ubicaciones-routing.module';
import { UbicacionesComponent } from './ubicaciones.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ UbicacionesComponent ],
  imports: [
    CommonModule,
    UbicacionesRoutingModule,
    SharedModule
  ]
})
export class UbicacionesModule { }
