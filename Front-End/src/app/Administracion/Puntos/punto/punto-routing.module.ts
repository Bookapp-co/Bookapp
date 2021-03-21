import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PuntoComponent } from './punto.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PuntoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuntoRoutingModule { }
