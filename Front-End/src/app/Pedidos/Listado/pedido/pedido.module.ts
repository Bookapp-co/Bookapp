import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidoRoutingModule } from './pedido-routing.module';
import { PedidoComponent } from './pedido.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ PedidoComponent ],
  imports: [
    CommonModule,
    PedidoRoutingModule,
    SharedModule
  ]
})
export class PedidoModule { }
