import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ConfiguracionComponent } from './configuracion.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ ConfiguracionComponent ],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    SharedModule
  ]
})
export class ConfiguracionModule { }
