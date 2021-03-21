import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { AnalyticsComponent } from './analytics.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ AnalyticsComponent ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class AnalyticsModule { }
