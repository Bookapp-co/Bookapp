import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalRoutingModule } from './sucursal-routing.module';
import { SucursalComponent } from './sucursal.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ SucursalComponent ],
  imports: [
    CommonModule,
    SucursalRoutingModule,
    SharedModule
  ]
})
export class SucursalModule { }
