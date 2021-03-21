import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DistanciasComponent } from './distancias.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: DistanciasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistanciasRoutingModule { }
