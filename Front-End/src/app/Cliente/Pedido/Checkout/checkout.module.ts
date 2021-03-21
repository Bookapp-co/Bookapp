import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { SharedModule } from '../../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
  declarations: [ CheckoutComponent ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
    SlickCarouselModule,
    MatStepperModule,
  ]
})
export class CheckoutModule { }
