import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiemposRoutingModule } from './tiempos-routing.module';
import { TiemposComponent } from './tiempos.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ TiemposComponent ],
  imports: [
    CommonModule,
    TiemposRoutingModule,
    SharedModule
  ]
})
export class TiemposModule { }
