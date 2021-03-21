import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AyudaRoutingModule } from './ayuda-routing.module';
import { AyudaComponent } from './ayuda.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ AyudaComponent ],
  imports: [
    CommonModule,
    AyudaRoutingModule,
    SharedModule
  ]
})
export class AyudaModule { }
