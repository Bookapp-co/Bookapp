import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaProductosRoutingModule } from './categoria-routing.module';
import { CategoriaProductosComponent } from './categoria.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ CategoriaProductosComponent ],
  imports: [
    CommonModule,
    CategoriaProductosRoutingModule,
    SharedModule
  ]
})
export class CategoriaProductosModule { }
