import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeleccionComponent } from './seleccion.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: SeleccionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeleccionRoutingModule { }
