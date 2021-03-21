import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiempoRoutingModule } from './tiempo-routing.module';
import { TiempoComponent } from './tiempo.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ TiempoComponent ],
  imports: [
    CommonModule,
    TiempoRoutingModule,
    SharedModule
  ]
})
export class TiempoModule { }
