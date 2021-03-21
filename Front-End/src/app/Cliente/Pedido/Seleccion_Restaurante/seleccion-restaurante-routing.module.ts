import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeleccionRestauranteComponent } from './seleccion-restaurante.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: SeleccionRestauranteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeleccionRestauranteRoutingModule { }
