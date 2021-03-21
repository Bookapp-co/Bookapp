import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertasClienteRoutingModule } from './alertas-routing.module';
import { AlertasClienteComponent } from './alertas.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ AlertasClienteComponent ],
  imports: [
    CommonModule,
    AlertasClienteRoutingModule,
    SharedModule
  ]
})
export class AlertasClienteModule { }
