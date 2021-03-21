import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertaRoutingModule } from './alerta-routing.module';
import { AlertaComponent } from './alerta.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ AlertaComponent ],
  imports: [
    CommonModule,
    AlertaRoutingModule,
    SharedModule
  ]
})
export class AlertaModule { }
