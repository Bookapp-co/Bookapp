import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriaProductosComponent } from './categoria.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: CategoriaProductosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaProductosRoutingModule { }
