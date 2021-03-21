import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NegociosRoutingModule } from './negocios-routing.module';
import { NegociosComponent } from './negocios.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ NegociosComponent ],
  imports: [
    CommonModule,
    NegociosRoutingModule,
    SharedModule
  ]
})
export class NegociosModule { }
