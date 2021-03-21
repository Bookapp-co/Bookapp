import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PuntosComponent } from './puntos.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PuntosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PuntosRoutingModule { }
