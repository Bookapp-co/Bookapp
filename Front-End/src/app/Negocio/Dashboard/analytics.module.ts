import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsNegocioRoutingModule } from './analytics-routing.module';
import { AnalyticsNegocioComponent } from './analytics.component';
import { SharedModule } from '../../shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@NgModule({
  declarations: [ AnalyticsNegocioComponent ],
  imports: [
    CommonModule,
    AnalyticsNegocioRoutingModule,
    SharedModule,
    SlickCarouselModule
  ]
})
export class AnalyticsNegocioModule { }
