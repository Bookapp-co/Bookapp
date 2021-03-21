import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidosAdminComponent } from './pedidosadmin.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PedidosAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosAdminRoutingModule { }
