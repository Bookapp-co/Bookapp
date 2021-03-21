import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatillosRoutingModule } from './platillos-routing.module';
import { PlatillosComponent } from './platillos.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ PlatillosComponent ],
  imports: [
    CommonModule,
    PlatillosRoutingModule,
    SharedModule
  ]
})
export class PlatillosModule { }
