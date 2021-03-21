import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientePuntosComponent } from './clientepuntos.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: ClientePuntosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientePuntosRoutingModule { }
