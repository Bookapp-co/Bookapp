import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UbicacionesComponent } from './ubicaciones.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: UbicacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbicacionesRoutingModule { }
