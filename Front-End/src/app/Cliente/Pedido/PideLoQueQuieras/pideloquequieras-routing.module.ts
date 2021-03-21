import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PideLoQueQuierasComponent } from './pideloquequieras.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: PideLoQueQuierasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PideLoQueQuierasRoutingModule { }
