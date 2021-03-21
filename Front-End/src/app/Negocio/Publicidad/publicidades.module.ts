import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicidadesRoutingModule } from './publicidades-routing.module';
import { PublicidadesComponent } from './publicidades.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ PublicidadesComponent ],
  imports: [
    CommonModule,
    PublicidadesRoutingModule,
    SharedModule
  ]
})
export class PublicidadesModule { }
