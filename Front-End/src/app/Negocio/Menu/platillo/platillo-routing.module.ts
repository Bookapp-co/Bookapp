import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlatilloComponent } from './platillo.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PlatilloComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlatilloRoutingModule { }
