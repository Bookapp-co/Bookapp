import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { CatalogosComponent } from './catalogos.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [ CatalogosComponent ],
  imports: [
    CommonModule,
    CatalogosRoutingModule,
    SharedModule
  ]
})
export class CatalogosModule { }
