import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicidadRoutingModule } from './publicidad-routing.module';
import { PublicidadComponent } from './publicidad.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ PublicidadComponent ],
  imports: [
    CommonModule,
    PublicidadRoutingModule,
    SharedModule
  ]
})
export class PublicidadModule { }
