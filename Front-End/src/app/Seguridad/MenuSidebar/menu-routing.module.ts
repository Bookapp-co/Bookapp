import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSidebarComponent } from './menu.component';

// const routes: Routes = [];

const routes: Routes = [
  {
    path: '',
    component: MenuSidebarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuSidebarRoutingModule { }
