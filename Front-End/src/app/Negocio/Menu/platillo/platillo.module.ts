import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatilloRoutingModule } from './platillo-routing.module';
import { PlatilloComponent } from './platillo.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ PlatilloComponent ],
  imports: [
    CommonModule,
    PlatilloRoutingModule,
    SharedModule
  ]
})
export class PlatilloModule { }
