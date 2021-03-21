import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilNegocioComponent } from './negocio.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PerfilNegocioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilNegocioRoutingModule { }
