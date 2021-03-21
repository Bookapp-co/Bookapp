import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriaRoutingModule } from './categoria-routing.module';
import { CategoriaComponent } from './categoria.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ CategoriaComponent ],
  imports: [
    CommonModule,
    CategoriaRoutingModule,
    SharedModule
  ]
})
export class CategoriaNegocioModule { }
