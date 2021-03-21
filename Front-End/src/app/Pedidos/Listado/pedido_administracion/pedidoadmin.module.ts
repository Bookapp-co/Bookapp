import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoAdminRoutingModule } from './pedidoadmin-routing.module';
import { PedidoAdminComponent } from './pedidoadmin.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ PedidoAdminComponent ],
  imports: [
    CommonModule,
    PedidoAdminRoutingModule,
    SharedModule
  ]
})
export class PedidoAdminModule { }
