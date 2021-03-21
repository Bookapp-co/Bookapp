import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeleccionCategoriaComponent } from './seleccion-categoria.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: SeleccionCategoriaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeleccionCategoriaRoutingModule { }
