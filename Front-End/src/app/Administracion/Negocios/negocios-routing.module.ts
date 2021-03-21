import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NegociosComponent } from './negocios.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: NegociosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NegociosRoutingModule { }
