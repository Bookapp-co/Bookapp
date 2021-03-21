import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferidoComponent } from './referido.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: ReferidoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferidoRoutingModule { }
