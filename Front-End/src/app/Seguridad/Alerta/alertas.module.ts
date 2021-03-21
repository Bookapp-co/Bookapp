import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertasRoutingModule } from './alertas-routing.module';
import { AlertasComponent } from './alertas.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ AlertasComponent ],
  imports: [
    CommonModule,
    AlertasRoutingModule,
    SharedModule
  ]
})
export class AlertasModule { }
