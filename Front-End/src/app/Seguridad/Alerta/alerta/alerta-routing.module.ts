import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertaComponent } from './alerta.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: AlertaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertaRoutingModule { }
