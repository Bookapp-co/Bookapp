import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PideLoQueQuierasRoutingModule } from './pideloquequieras-routing.module';
import { PideLoQueQuierasComponent } from './pideloquequieras.component';
import { SharedModule } from '../../../shared.module';

@NgModule({
  declarations: [ PideLoQueQuierasComponent ],
  imports: [
    CommonModule,
    PideLoQueQuierasRoutingModule,
    SharedModule
  ]
})
export class PideLoQueQuierasModule { }
