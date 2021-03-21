import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsNegocioComponent } from './analytics.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: AnalyticsNegocioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsNegocioRoutingModule { }
