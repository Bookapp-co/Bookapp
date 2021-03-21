import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TiempoComponent } from './tiempo.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: TiempoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiempoRoutingModule { }
