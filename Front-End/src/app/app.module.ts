import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
// import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {NgReduxModule} from '@angular-redux/store';
// import {NgRedux, DevToolsExtension} from '@angular-redux/store';
// rootReducer
import {ArchitectUIState} from './ThemeOptions/store';
import {ConfigActions} from './ThemeOptions/store/config.actions';
import {AppRoutingModule} from './app-routing.module';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';

import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';

// BOOTSTRAP COMPONENTS

// import {AngularFontAwesomeModule} from 'angular-font-awesome';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {LaddaModule} from 'angular2-ladda';
import {NgxLoadingModule} from 'ngx-loading';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
// import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
// import {ToastrModule} from 'ngx-toastr';
// import {SlickCarouselModule} from 'ngx-slick-carousel';
// import {CalendarModule, DateAdapter} from 'angular-calendar';
// import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
// import {CountUpModule} from 'countup.js-angular2';
// import {AgmCoreModule} from '@agm/core';
// import {ImageCropperModule} from 'ngx-image-cropper';
import {NgBootstrapFormValidationModule} from 'ng-bootstrap-form-validation';
// import {AngularStickyThingsModule} from '@w11k/angular-sticky-things';
// import {NouisliderModule} from 'ng2-nouislider';
// import {NgSelectModule} from '@ng-select/ng-select';
// import {SelectDropDownModule} from 'ngx-select-dropdown';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
// import {AngularEditorModule} from '@kolkov/angular-editor';
// import {TextMaskModule} from 'angular2-text-mask';
// import {ClipboardModule} from 'ngx-clipboard';
// import {TextareaAutosizeModule} from 'ngx-textarea-autosize';
// import {ColorPickerModule} from 'ngx-color-picker';
import {DropzoneModule} from 'ngx-dropzone-wrapper';
// import {DROPZONE_CONFIG} from 'ngx-dropzone-wrapper';
import {DropzoneConfigInterface} from 'ngx-dropzone-wrapper';
// import {ChartsModule} from 'ng2-charts';

// ANGULAR MATERIAL COMPONENTS

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
// import {MatCheckboxModule, MatRippleModule} from '@angular/material';
// import {MatButtonModule} from '@angular/material';
// import {MatInputModule} from '@angular/material/input';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';
// import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatRadioModule} from '@angular/material/radio';
// import {MatSelectModule} from '@angular/material/select';
// import {MatSliderModule} from '@angular/material/slider';
// import {MatSlideToggleModule} from '@angular/material/slide-toggle';
// import {MatMenuModule} from '@angular/material/menu';
// import {MatSidenavModule} from '@angular/material/sidenav';
// import {MatToolbarModule} from '@angular/material/toolbar';
// import {MatListModule} from '@angular/material/list';
// import {MatGridListModule} from '@angular/material/grid-list';
// import {MatCardModule} from '@angular/material/card';
// import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
// import {MatExpansionModule} from '@angular/material/expansion';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import {MatChipsModule} from '@angular/material/chips';
// import {MatIconModule} from '@angular/material/icon';
// import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
// import {MatProgressBarModule} from '@angular/material/progress-bar';
// import {MatDialogModule} from '@angular/material/dialog';
// import {MatTooltipModule} from '@angular/material/tooltip';
// import {MatSnackBarModule} from '@angular/material/snack-bar';
// import {MatTableModule} from '@angular/material/table';
// import {MatSortModule} from '@angular/material/sort';
// import {MatPaginatorModule} from '@angular/material/paginator';
// import {MatTreeModule} from '@angular/material/tree';

// LAYOUT

import {BaseLayoutComponent} from './Layout/base-layout/base-layout.component';
import {AppsLayoutComponent} from './Layout/apps-layout/apps-layout.component';
import {PagesLayoutComponent} from './Layout/pages-layout/pages-layout.component';
import {ThemeOptions} from './theme-options';
// import {OptionsDrawerComponent} from './ThemeOptions/options-drawer/options-drawer.component';
// import {PageTitleComponent} from './Layout/Components/page-title/page-title.component';

// HEADER

import {HeaderComponent} from './Layout/Components/header/header.component';
import {DotsComponent} from './Layout/Components/header/elements/dots/dots.component';
import {SearchBoxComponent} from './Layout/Components/header/elements/search-box/search-box.component';
import {MegamenuComponent} from './Layout/Components/header/elements/mega-menu/mega-menu.component';
import {MegapopoverComponent} from './Layout/Components/header/elements/mega-menu/elements/megapopover/megapopover.component';
import {DrawerComponent} from './Layout/Components/header/elements/drawer/drawer.component';

// SIDEBAR

import {SidebarComponent} from './Layout/Components/sidebar/sidebar.component';
import {LogoComponent} from './Layout/Components/sidebar/elements/logo/logo.component';

// FOOTER

import {FooterComponent} from './Layout/Components/footer/footer.component';
import {FooterDotsComponent} from './Layout/Components/footer/elements/footer-dots/footer-dots.component';
import {FooterMenuComponent} from './Layout/Components/footer/elements/footer-menu/footer-menu.component';

// DEMO PAGES

// Dashboards

// import {AnalyticsComponent} from './DemoPages/Dashboards/analytics/analytics.component';
// import {AdvertisementComponent} from './DemoPages/Dashboards/advertisement/advertisement.component';
// import {ManagementComponent} from './DemoPages/Dashboards/management/management.component';
// import {HelpdeskComponent} from './DemoPages/Dashboards/helpdesk/helpdesk.component';
// import {MonitoringComponent} from './DemoPages/Dashboards/monitoring/monitoring.component';
// import {CryptoComponent} from './DemoPages/Dashboards/crypto/crypto.component';
// import {ProjectManagementComponent} from './DemoPages/Dashboards/project-management/project-management.component';
// import {ProductComponent} from './DemoPages/Dashboards/product/product.component';
// import {StatisticsComponent} from './DemoPages/Dashboards/statistics/statistics.component';

// Applications

// import {ChatComponent} from './DemoPages/Applications/chat/chat.component';
// import {MailboxComponent} from './DemoPages/Applications/mailbox/mailbox.component';
// import {MaterialTabsComponent} from './DemoPages/Applications/material-tabs/material-tabs.component';

// Pages

// import {ForgotPasswordComponent} from './DemoPages/UserPages/forgot-password/forgot-password.component';
// import {ForgotPasswordBoxedComponent} from './DemoPages/UserPages/forgot-password-boxed/forgot-password-boxed.component';
// import {LoginBoxedComponent} from './DemoPages/UserPages/login-boxed/login-boxed.component';
// import {LoginComponent} from './DemoPages/UserPages/login/login.component';
// import {RegisterBoxedComponent} from './DemoPages/UserPages/register-boxed/register-boxed.component';
// import {RegisterComponent} from './DemoPages/UserPages/register/register.component';

// Elements

// import {StandardComponent} from './DemoPages/Elements/Buttons/standard/standard.component';
// import {PillsComponent} from './DemoPages/Elements/Buttons/pills/pills.component';
// import {SquareComponent} from './DemoPages/Elements/Buttons/square/square.component';
// import {ShadowComponent} from './DemoPages/Elements/Buttons/shadow/shadow.component';
// import {ButtonIconsComponent} from './DemoPages/Elements/Buttons/icons/icons.component';
// import {DropdownsComponent} from './DemoPages/Elements/dropdowns/dropdowns.component';
// import {BadgesComponent} from './DemoPages/Elements/badges/badges.component';
// import {CardsComponent} from './DemoPages/Elements/cards/cards.component';
// import {LoadingIndicatorsComponent} from './DemoPages/Elements/loading-indicators/loading-indicators.component';
// import {ListGroupsComponent} from './DemoPages/Elements/list-groups/list-groups.component';
// import {NavigationMenusComponent} from './DemoPages/Elements/navigation-menus/navigation-menus.component';
// import {TimelineComponent} from './DemoPages/Elements/timeline/timeline.component';
// import {UtilitiesComponent} from './DemoPages/Elements/utilities/utilities.component';
// import {IconsComponent} from './DemoPages/Elements/icons/icons.component';

// Components

// import {AccordionsComponent} from './DemoPages/Components/accordions/accordions.component';
// import {TabsComponent} from './DemoPages/Components/tabs/tabs.component';
// import {CalendarComponent} from './DemoPages/Components/calendar/calendar.component';
// import {CarouselComponent} from './DemoPages/Components/carousel/carousel.component';
// import {ImageCropComponent} from './DemoPages/Components/image-crop/image-crop.component';
// import {CountUpComponent} from './DemoPages/Components/count-up/count-up.component';
// import {MapsComponent} from './DemoPages/Components/maps/maps.component';
// import {ModalsComponent} from './DemoPages/Components/modals/modals.component';
// import {NotificationsComponent} from './DemoPages/Components/notifications/notifications.component';
// import {ProgressBarComponent} from './DemoPages/Components/progress-bar/progress-bar.component';
// import {PaginationComponent} from './DemoPages/Components/pagination/pagination.component';
// import {RatingsComponent} from './DemoPages/Components/ratings/ratings.component';
// import {ScrollableComponent} from './DemoPages/Components/scrollable/scrollable.component';
// import {TooltipsPopoversComponent} from './DemoPages/Components/tooltips-popovers/tooltips-popovers.component';
// import {NgbdSortableHeaderDirective} from './DemoPages/Tables/dynamic/demo/sortable.directive';

// Tables

// import {RegularComponent} from './DemoPages/Tables/regular/regular.component';
// import {DynamicComponent} from './DemoPages/Tables/dynamic/dynamic.component';
// import {TablesMainComponent} from './DemoPages/Tables/tables-main/tables-main.component';
//
// // Widgets
//
// import {ChartBoxes1Component} from './DemoPages/Widgets/chart-boxes1/chart-boxes1.component';
// import {ChartBoxes2Component} from './DemoPages/Widgets/chart-boxes2/chart-boxes2.component';
// import {ChartBoxes3Component} from './DemoPages/Widgets/chart-boxes3/chart-boxes3.component';
// import {ProfileBoxesComponent} from './DemoPages/Widgets/profile-boxes/profile-boxes.component';
//
// // Forms Elements
//
// import {ControlsComponent} from './DemoPages/Forms/Elements/controls/controls.component';
// import {LayoutComponent} from './DemoPages/Forms/Elements/layout/layout.component';
// import {ValidationComponent} from './DemoPages/Forms/Elements/validation/validation.component';
// import {StickyHeadersComponent} from './DemoPages/Forms/Elements/sticky-headers/sticky-headers.component';

// Forms Components

// import {DatepickerComponent} from './DemoPages/Forms/Widgets/datepicker/datepicker.component';
// import {TimepickerComponent} from './DemoPages/Forms/Widgets/timepicker/timepicker.component';
// import {TypeaheadComponent} from './DemoPages/Forms/Widgets/typeahead/typeahead.component';
// import {RangeSliderComponent} from './DemoPages/Forms/Widgets/range-slider/range-slider.component';
// import {InputSelectsComponent} from './DemoPages/Forms/Widgets/input-selects/input-selects.component';
// import {ToggleSwitchComponent} from './DemoPages/Forms/Widgets/toggle-switch/toggle-switch.component';
// import {WysiwygEditorComponent} from './DemoPages/Forms/Widgets/wysiwyg-editor/wysiwyg-editor.component';
// import {InputMaskComponent} from './DemoPages/Forms/Widgets/input-mask/input-mask.component';
// import {ClipboardComponent} from './DemoPages/Forms/Widgets/clipboard/clipboard.component';
// import {TextareaAutosizeComponent} from './DemoPages/Forms/Widgets/textarea-autosize/textarea-autosize.component';
// import {ColorpickerComponent} from './DemoPages/Forms/Widgets/colorpicker/colorpicker.component';
// import {DropzoneComponent} from './DemoPages/Forms/Widgets/dropzone/dropzone.component';

// Charts

// import {ChartjsComponent} from './DemoPages/Charts/chartjs/chartjs.component';
// import {ApexchartsComponent} from './DemoPages/Charts/apexcharts/apexcharts.component';
// import {GaugesComponent} from './DemoPages/Charts/gauges/gauges.component';
// import {SparklinesComponent} from './DemoPages/Charts/sparklines/sparklines.component';

// Chart.js Examples

// import {LineChartComponent} from './DemoPages/Charts/chartjs/examples/line-chart/line-chart.component';
// import {BarChartComponent} from './DemoPages/Charts/chartjs/examples/bar-chart/bar-chart.component';
// import {ScatterChartComponent} from './DemoPages/Charts/chartjs/examples/scatter-chart/scatter-chart.component';
// import {RadarChartComponent} from './DemoPages/Charts/chartjs/examples/radar-chart/radar-chart.component';
// import {PolarAreaChartComponent} from './DemoPages/Charts/chartjs/examples/polar-area-chart/polar-area-chart.component';
// import {BubbleChartComponent} from './DemoPages/Charts/chartjs/examples/bubble-chart/bubble-chart.component';
// import {DynamicChartComponent} from './DemoPages/Charts/chartjs/examples/dynamic-chart/dynamic-chart.component';
// import {DoughnutChartComponent} from './DemoPages/Charts/chartjs/examples/doughnut-chart/doughnut-chart.component';
// import {PieChartComponent} from './DemoPages/Charts/chartjs/examples/pie-chart/pie-chart.component';

// Apex Charts

// import {NgApexchartsModule} from 'ng-apexcharts';
// import {SeriesPipe} from './DemoPages/Charts/apexcharts/series.pipe';

// Gauges Charts

import {GaugeModule} from 'angular-gauge';
// import {TrendModule} from 'ngx-trend';

// Angular Material

// import {AutoCompleteComponent} from './DemoPages/Material/FormControls/auto-complete/auto-complete.component';
// import {CheckboxComponent} from './DemoPages/Material/FormControls/checkbox/checkbox.component';
// import {RadioComponent} from './DemoPages/Material/FormControls/radio/radio.component';
// import {DatepickerComponent2} from './DemoPages/Material/FormControls/mat-datepicker/mat-datepicker.component';
// import {FormFieldComponent} from './DemoPages/Material/FormControls/form-field/form-field.component';
// import {InputComponent} from './DemoPages/Material/FormControls/input/input.component';
// import {SelectComponent} from './DemoPages/Material/FormControls/select/select.component';
// import {SliderComponent} from './DemoPages/Material/FormControls/slider/slider.component';
// import {SliderToggleComponent} from './DemoPages/Material/FormControls/slider-toggle/slider-toggle.component';
// import {MenuMatComponent} from './DemoPages/Material/Layout/menu/menu.component';
// import {CardMatComponent} from './DemoPages/Material/Layout/card/card.component';
// import {DividerComponent} from './DemoPages/Material/Layout/divider/divider.component';
// import {ExpansionPanelComponent} from './DemoPages/Material/Layout/expansion-panel/expansion-panel.component';
// import {GridListComponent} from './DemoPages/Material/Layout/grid-list/grid-list.component';
// import {ListMatComponent} from './DemoPages/Material/Layout/list/list.component';
// import {StepperComponent} from './DemoPages/Material/Layout/stepper/stepper.component';
// import {TreeComponent} from './DemoPages/Material/Layout/tree/tree.component';
// import {ButtonToggleComponent} from './DemoPages/Material/ButtonsIndicators/button-toggle/button-toggle.component';
// import {ChipsComponent} from './DemoPages/Material/ButtonsIndicators/chips/chips.component';
// import {ProgressSpinnerComponent} from './DemoPages/Material/ButtonsIndicators/progress-spinner/progress-spinner.component';
// import {RipplesComponent} from './DemoPages/Material/ButtonsIndicators/ripples/ripples.component';
// import {SnackbarComponent} from './DemoPages/Material/Layout/snackbar/snackbar.component';
// import {TooltipComponent} from './DemoPages/Material/Layout/tooltip/tooltip.component';
// import {PaginatorComponent} from './DemoPages/Material/Datatable/paginator/paginator.component';
// import {TableComponent} from './DemoPages/Material/Datatable/table/table.component';
// import {MatTabsComponent} from './DemoPages/Material/Layout/mat-tabs/mat-tabs.component';
// import {MatButtonsComponent} from './DemoPages/Material/ButtonsIndicators/mat-buttons/mat-buttons.component';
// import {MatProgressBarComponent} from './DemoPages/Material/ButtonsIndicators/mat-progress-bar/mat-progress-bar.component';

// CODIGEEK

import { DataService } from './data.service';
import { SharedModule } from './shared.module';

// CODIGEEK COMPONENTS



console.log("App Main Module Entered");

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  declarations: [

    // LAYOUT

    AppComponent,
    BaseLayoutComponent,
    AppsLayoutComponent,
    PagesLayoutComponent,
    // OptionsDrawerComponent,
    // PageTitleComponent,

    // HEADER

    HeaderComponent,
    DotsComponent,
    SearchBoxComponent,
    MegamenuComponent,
    MegapopoverComponent,
    DrawerComponent,

    // SIDEBAR

    SidebarComponent,
    LogoComponent,

    // FOOTER

    FooterComponent,
    FooterDotsComponent,
    FooterMenuComponent,

    // DEMO PAGES

    // Dashboards

    // AnalyticsComponent,
    // AdvertisementComponent,
    // ManagementComponent,
    // HelpdeskComponent,
    // MonitoringComponent,
    // CryptoComponent,
    // ProjectManagementComponent,
    // ProductComponent,
    // StatisticsComponent,

    // Applications

    // ChatComponent,
    // MailboxComponent,
    // MaterialTabsComponent,

    // User Pages

    // ForgotPasswordComponent,
    // ForgotPasswordBoxedComponent,
    // LoginBoxedComponent,
    // LoginComponent,
    // RegisterBoxedComponent,
    // RegisterComponent,

    // Elements

    // StandardComponent,
    // PillsComponent,
    // SquareComponent,
    // ShadowComponent,
    // IconsComponent,
    // DropdownsComponent,
    // BadgesComponent,
    // CardsComponent,
    // LoadingIndicatorsComponent,
    // ListGroupsComponent,
    // NavigationMenusComponent,
    // TimelineComponent,
    // UtilitiesComponent,
    // ButtonIconsComponent,
    //
    // // Components
    //
    // AccordionsComponent,
    // TabsComponent,
    // CalendarComponent,
    // CarouselComponent,
    // ImageCropComponent,
    // CountUpComponent,
    // MapsComponent,
    // ModalsComponent,
    // NotificationsComponent,
    // ProgressBarComponent,
    // PaginationComponent,
    // RatingsComponent,
    // ScrollableComponent,
    // TooltipsPopoversComponent,
    //
    // // Tables
    //
    // RegularComponent,
    // DynamicComponent,
    // TablesMainComponent,
    //
    // // Dashboard Boxes
    //
    // ChartBoxes1Component,
    // ChartBoxes2Component,
    // ChartBoxes3Component,
    // ProfileBoxesComponent,
    //
    // // Form Elements
    //
    // ControlsComponent,
    // LayoutComponent,
    // ValidationComponent,
    // StickyHeadersComponent,

    // Form Widgets

    // DatepickerComponent,
    // TimepickerComponent,
    // RangeSliderComponent,
    // InputSelectsComponent,
    // ToggleSwitchComponent,
    // WysiwygEditorComponent,
    // InputMaskComponent,
    // ClipboardComponent,
    // TextareaAutosizeComponent,
    // ColorpickerComponent,
    // DropzoneComponent,
    // TypeaheadComponent,

    // CHARTS

    // ChartjsComponent,
    // ApexchartsComponent,
    // GaugesComponent,
    // SparklinesComponent,

    // Apex Charts

    // SeriesPipe,

    // Chart.js Examples

    // LineChartComponent,
    // BarChartComponent,
    // DoughnutChartComponent,
    // RadarChartComponent,
    // PieChartComponent,
    // PolarAreaChartComponent,
    // DynamicChartComponent,
    // BubbleChartComponent,
    // ScatterChartComponent,

    // ANGULAR MATERIAL

    // AutoCompleteComponent,
    // CheckboxComponent,
    // RadioComponent,
    // DatepickerComponent2,
    // FormFieldComponent,
    // InputComponent,
    // SelectComponent,
    // SliderComponent,
    // SliderToggleComponent,
    // MenuMatComponent,
    // CardMatComponent,
    // DividerComponent,
    // ExpansionPanelComponent,
    // GridListComponent,
    // MatTabsComponent,
    // ListMatComponent,
    // StepperComponent,
    // TreeComponent,
    // ButtonToggleComponent,
    // ChipsComponent,
    // MatButtonsComponent,
    // ProgressSpinnerComponent,
    // RipplesComponent,
    // SnackbarComponent,
    // TooltipComponent,
    // PaginatorComponent,
    // TableComponent,
    // MatTabsComponent,
    // MatButtonsComponent,
    // MatProgressBarComponent,
    // NgbdSortableHeaderDirective,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // NgReduxModule,
    CommonModule,
    LoadingBarRouterModule,
    SharedModule,

    // Angular Bootstrap Components

    // PerfectScrollbarModule,
    // NgbModule,
    // AngularFontAwesomeModule,
    LaddaModule,
    // FormsModule,
    // ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    RoundProgressModule,
    // SweetAlert2Module.forRoot({
    //   buttonsStyling: false,
    //   customClass: 'modal-content',
    //   confirmButtonClass: 'btn btn-primary',
    //   cancelButtonClass: 'btn'
    // }),
    // ToastrModule.forRoot(),
    // SlickCarouselModule,
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory
    // }),
    // CountUpModule,

    // ImageCropperModule,
    // AngularStickyThingsModule,
    // NouisliderModule,
    // NgSelectModule,
    // SelectDropDownModule,
    NgMultiSelectDropDownModule.forRoot(),
    // AngularEditorModule,
    HttpClientModule,
    // TextMaskModule,
    // ClipboardModule,
    // TextareaAutosizeModule,
    // ColorPickerModule,
    DropzoneModule,

    // Charts

    // ChartsModule,
    // NgApexchartsModule,
    // GaugeModule.forRoot(),
    // TrendModule,

    // Angular Material Components

    MatCheckboxModule,
    MatCheckboxModule,
    // MatButtonModule,
    // MatInputModule,
    // MatAutocompleteModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatFormFieldModule,
    // MatRadioModule,
    // MatSelectModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatMenuModule,
    // MatSidenavModule,
    // MatToolbarModule,
    // MatListModule,
    // MatGridListModule,
    // MatCardModule,
    // MatStepperModule,
    MatTabsModule,
    // MatExpansionModule,
    // MatButtonToggleModule,
    // MatChipsModule,
    // MatIconModule,
    // MatProgressSpinnerModule,
    // MatProgressBarModule,
    // MatDialogModule,
    // MatTooltipModule,
    // MatSnackBarModule,
    // MatTableModule,
    // MatSortModule,
    // MatPaginatorModule,
    // MatTreeModule,
    // MatRippleModule
  ],
  exports: [
    SharedModule
  //   AngularFontAwesomeModule,
  //   PerfectScrollbarModule,
  //   TrendModule
  ],
  providers: [
    DataService,
    {
      provide:
      PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue:
      DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      // DEFAULT_DROPZONE_CONFIG,
    },
    ConfigActions,
    ThemeOptions
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(
    // private ngRedux: NgRedux<ArchitectUIState>,
              // private devTool: DevToolsExtension
            ) {

    // this.ngRedux.configureStore(
    //   rootReducer,
    //   {} as ArchitectUIState,
    //   [],
    //   [devTool.isEnabled() ? devTool.enhancer() : f => f]
    // );

  }
}
