import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidoAdminComponent } from './pedidoadmin.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PedidoAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoAdminRoutingModule { }
