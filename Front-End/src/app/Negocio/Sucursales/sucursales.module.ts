import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalesRoutingModule } from './sucursales-routing.module';
import { SucursalesComponent } from './sucursales.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ SucursalesComponent ],
  imports: [
    CommonModule,
    SucursalesRoutingModule,
    SharedModule
  ]
})
export class SucursalesModule { }
