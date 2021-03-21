import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecuperarComponent } from './recuperar.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: RecuperarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuperarRoutingModule { }
