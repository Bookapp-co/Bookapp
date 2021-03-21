import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NegocioRoutingModule } from './negocio-routing.module';
import { NegocioComponent } from './negocio.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ NegocioComponent ],
  imports: [
    CommonModule,
    NegocioRoutingModule,
    SharedModule
  ]
})
export class NegocioModule { }
