import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccesoRoutingModule } from './acceso-routing.module';
import { AccesoComponent } from './acceso.component';
import { SharedModule } from '../../../shared.module';

console.log("App Acceso Module Entered");

@NgModule({
  declarations: [ AccesoComponent ],
  imports: [
    CommonModule,
    AccesoRoutingModule,
    SharedModule
  ]
})
export class AccesoModule { }
