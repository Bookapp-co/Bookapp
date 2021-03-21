import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosAdminRoutingModule } from './pedidosadmin-routing.module';
import { PedidosAdminComponent } from './pedidosadmin.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ PedidosAdminComponent ],
  imports: [
    CommonModule,
    PedidosAdminRoutingModule,
    SharedModule
  ]
})
export class PedidosAdminModule { }
