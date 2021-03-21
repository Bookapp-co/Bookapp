import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilRestauranteComponent } from './perfil-restaurante.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PerfilRestauranteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRestauranteRoutingModule { }
