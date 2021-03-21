import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccesosRoutingModule } from './accesos-routing.module';
import { AccesosComponent } from './accesos.component';
import { SharedModule } from '../../shared.module';

console.log("App Accesos Module Entered");

@NgModule({
  declarations: [ AccesosComponent ],
  imports: [
    CommonModule,
    AccesosRoutingModule,
    SharedModule
  ]
})
export class AccesosModule { }
