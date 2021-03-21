import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NegocioComponent } from './negocio.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: NegocioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NegocioRoutingModule { }
