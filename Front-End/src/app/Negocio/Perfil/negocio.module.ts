import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilNegocioRoutingModule } from './negocio-routing.module';
import { PerfilNegocioComponent } from './negocio.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ PerfilNegocioComponent ],
  imports: [
    CommonModule,
    PerfilNegocioRoutingModule,
    SharedModule
  ]
})
export class PerfilNegocioModule { }
