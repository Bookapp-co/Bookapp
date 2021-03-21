import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertasClienteComponent } from './alertas.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: AlertasClienteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertasClienteRoutingModule { }
