import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PuntosRoutingModule } from './puntos-routing.module';
import { PuntosComponent } from './puntos.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ PuntosComponent ],
  imports: [
    CommonModule,
    PuntosRoutingModule,
    SharedModule
  ]
})
export class PuntosModule { }
