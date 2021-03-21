import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicidadesComponent } from './publicidades.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PublicidadesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicidadesRoutingModule { }
