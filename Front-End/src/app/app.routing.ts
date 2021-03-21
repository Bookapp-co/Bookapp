import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {BaseLayoutComponent} from './Layout/base-layout/base-layout.component';
import {PagesLayoutComponent} from './Layout/pages-layout/pages-layout.component';
import {AppsLayoutComponent} from './Layout/apps-layout/apps-layout.component';

// DEMO PAGES

// Dashboards
//
// // import {AnalyticsComponent} from './DemoPages/Dashboards/analytics/analytics.component';
// import {AdvertisementComponent} from './DemoPages/Dashboards/advertisement/advertisement.component';
// import {ManagementComponent} from './DemoPages/Dashboards/management/management.component';
// import {HelpdeskComponent} from './DemoPages/Dashboards/helpdesk/helpdesk.component';
// import {MonitoringComponent} from './DemoPages/Dashboards/monitoring/monitoring.component';
// import {CryptoComponent} from './DemoPages/Dashboards/crypto/crypto.component';
// import {ProjectManagementComponent} from './DemoPages/Dashboards/project-management/project-management.component';
// import {ProductComponent} from './DemoPages/Dashboards/product/product.component';
// import {StatisticsComponent} from './DemoPages/Dashboards/statistics/statistics.component';
//
// // Applications
//
// import {ChatComponent} from './DemoPages/Applications/chat/chat.component';
// import {MailboxComponent} from './DemoPages/Applications/mailbox/mailbox.component';
// import {MaterialTabsComponent} from './DemoPages/Applications/material-tabs/material-tabs.component';
//
// // Pages
//
// // import {ForgotPasswordComponent} from './DemoPages/UserPages/forgot-password/forgot-password.component';
// // import {ForgotPasswordBoxedComponent} from './DemoPages/UserPages/forgot-password-boxed/forgot-password-boxed.component';
// // import {LoginBoxedComponent} from './DemoPages/UserPages/login-boxed/login-boxed.component';
// // import {LoginComponent} from './DemoPages/UserPages/login/login.component';
// // import {RegisterBoxedComponent} from './DemoPages/UserPages/register-boxed/register-boxed.component';
// // import {RegisterComponent} from './DemoPages/UserPages/register/register.component';
//
// // Elements
//
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
//
// // Components
//
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
//
// // Tables
//
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
//
// // Forms Components
//
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
//
// // Charts
//
// import {ChartjsComponent} from './DemoPages/Charts/chartjs/chartjs.component';
// import {ApexchartsComponent} from './DemoPages/Charts/apexcharts/apexcharts.component';
// import {GaugesComponent} from './DemoPages/Charts/gauges/gauges.component';
// import {SparklinesComponent} from './DemoPages/Charts/sparklines/sparklines.component';
//
// // Angular Material
//
// import {AutoCompleteComponent} from './DemoPages/Material/FormControls/auto-complete/auto-complete.component';
// import {CheckboxComponent} from './DemoPages/Material/FormControls/checkbox/checkbox.component';
// import {RadioComponent} from './DemoPages/Material/FormControls/radio/radio.component';
// import {DatepickerComponent2} from './DemoPages/Material/FormControls/mat-datepicker/mat-datepicker.component';
// import {FormFieldComponent} from './DemoPages/Material/FormControls/form-field/form-field.component';
// import {InputComponent} from './DemoPages/Material/FormControls/input/input.component';
// import {SelectComponent} from './DemoPages/Material/FormControls/select/select.component';
// import {SliderComponent} from './DemoPages/Material/FormControls/slider/slider.component';
// import {SliderToggleComponent} from './DemoPages/Material/FormControls/slider-toggle/slider-toggle.component';
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
// import {MenuMatComponent} from './DemoPages/Material/Layout/menu/menu.component';
// import {MatTabsComponent} from './DemoPages/Material/Layout/mat-tabs/mat-tabs.component';
// import {MatButtonsComponent} from './DemoPages/Material/ButtonsIndicators/mat-buttons/mat-buttons.component';
// import {MatProgressBarComponent} from './DemoPages/Material/ButtonsIndicators/mat-progress-bar/mat-progress-bar.component';

// COMPONENT MODULES
// import { AnalyticsModule } from './DemoPages/Dashboards/analytics/analytics.module';
import { AuthGuard } from './_services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [

      // administracion
      { path: 'administracion/dashboard', loadChildren: () => import('./Administracion/Dashboard/analytics.module').then(mod => mod.AnalyticsModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'administracion/negocios', loadChildren: () => import('./Administracion/Negocios/negocios.module').then(mod => mod.NegociosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/negocio', loadChildren: () => import('./Administracion/Negocios/negocio/negocio.module').then(mod => mod.NegocioModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'administracion/categorias', loadChildren: () => import('./Administracion/Categorias/categorias.module').then(mod => mod.CategoriasModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/categoria', loadChildren: () => import('./Administracion/Categorias/categoria/categoria.module').then(mod => mod.CategoriaModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'administracion/usuarios', loadChildren: () => import('./Administracion/Usuarios/usuarios.module').then(mod => mod.UsuariosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/usuario', loadChildren: () => import('./Administracion/Usuarios/usuario/usuario.module').then(mod => mod.UsuarioModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'administracion/distancias', loadChildren: () => import('./Administracion/Distancias/distancias.module').then(mod => mod.DistanciasModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/distancia', loadChildren: () => import('./Administracion/Distancias/distancia/distancia.module').then(mod => mod.DistanciaModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'administracion/puntos', loadChildren: () => import('./Administracion/Puntos/puntos.module').then(mod => mod.PuntosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/punto', loadChildren: () => import('./Administracion/Puntos/punto/punto.module').then(mod => mod.PuntoModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'administracion/catalogos', loadChildren: () => import('./Administracion/Catalogos/catalogos.module').then(mod => mod.CatalogosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/catalogo', loadChildren: () => import('./Administracion/Catalogos/catalogo/catalogo.module').then(mod => mod.CatalogoModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/catalogos-categorias', loadChildren: () => import('./Administracion/Categorias_Productos/categorias.module').then(mod => mod.CategoriasProductosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/catalogos-categoria', loadChildren: () => import('./Administracion/Categorias_Productos/categoria/categoria.module').then(mod => mod.CategoriaProductosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/catalogos-productos', loadChildren: () => import('./Administracion/Productos/productos.module').then(mod => mod.ProductosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion/catalogos-producto', loadChildren: () => import('./Administracion/Productos/producto/producto.module').then(mod => mod.ProductoModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },


      // administracion negocio
      { path: 'negocio/dashboard', loadChildren: () => import('./Negocio/Dashboard/analytics.module').then(mod => mod.AnalyticsNegocioModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'administracion-negocio/categorias', loadChildren: () => import('./Negocio/Categorias/categorias.module').then(mod => mod.CategoriasNegocioModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion-negocio/categoria', loadChildren: () => import('./Negocio/Categorias/categoria/categoria.module').then(mod => mod.CategoriaNegocioModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'administracion-negocio/menu', loadChildren: () => import('./Negocio/Menu/platillos.module').then(mod => mod.PlatillosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'administracion-negocio/platillo', loadChildren: () => import('./Negocio/Menu/platillo/platillo.module').then(mod => mod.PlatilloModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      // cliente
      { path: 'cliente/inicio', loadChildren: () => import('./Cliente/Pedido/Seleccion/seleccion.module').then(mod => mod.SeleccionModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },
      { path: 'cliente/pideloquequieras', loadChildren: () => import('./Cliente/Pedido/PideLoQueQuieras/pideloquequieras.module').then(mod => mod.PideLoQueQuierasModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'cliente/seleccion-categoria', loadChildren: () => import('./Cliente/Pedido/Seleccion_Categoria/seleccion-categoria.module').then(mod => mod.SeleccionCategoriaModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'cliente/seleccion-negocio', loadChildren: () => import('./Cliente/Pedido/Seleccion_Restaurante/seleccion-restaurante.module').then(mod => mod.SeleccionRestauranteModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'cliente/perfil-restaurante', loadChildren: () => import('./Cliente/Pedido/Perfil_Restaurante/perfil-restaurante.module').then(mod => mod.PerfilRestauranteModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'cliente/perfil', loadChildren: () => import('./Cliente/Perfil/perfil.module').then(mod => mod.PerfilModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'cliente/puntos', loadChildren: () => import('./Cliente/Puntos/clientepuntos.module').then(mod => mod.ClientePuntosModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'pedido/chat', loadChildren: () => import('./Pedidos/Chat/pedido-chat.module').then(mod => mod.PedidoChatModule), data: {extraParameter: 'dashboardsMenu', animation: 'PedidoChatModule'} },

      // Seguridad

      { path: 'seguridad/usuarios', loadChildren: () => import('./Seguridad/usuarios/usuarios.module').then(mod => mod.UsuariosModule), data: {extraParameter: 'dashboardsMenu'} },
      { path: 'seguridad/accesos', loadChildren: () => import('./Seguridad/accesos/accesos.module').then(mod => mod.AccesosModule), data: {extraParameter: 'dashboardsMenu'} },

      // Pedidos

      { path: 'pedidos/listado', loadChildren: () => import('./Pedidos/Listado/pedidos.module').then(mod => mod.PedidosModule), data: {extraParameter: 'dashboardsMenu'} },
      { path: 'pedidos/pedido', loadChildren: () => import('./Pedidos/Listado/pedido/pedido.module').then(mod => mod.PedidoModule), data: {extraParameter: 'dashboardsMenu'} },
      // { path: 'pedidos/pedido', loadChildren: () => import('./Pedidos/Listado/pedido/pedido.module').then(mod => mod.PedidoModule), data: {extraParameter: 'dashboardsMenu'} },

      { path: 'usuario/menu', loadChildren: () => import('./Seguridad/Opciones/menu.module').then(mod => mod.MenuModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'general/notificaciones', loadChildren: () => import('./General/Notificaciones/notificaciones.module').then(mod => mod.NotificacionesModule), data: {extraParameter: 'dashboardsMenu', animation: 'Notifications'}, canActivate: [AuthGuard] },

      { path: 'pedidos/checkout', loadChildren: () => import('./Cliente/Pedido/Checkout/checkout.module').then(mod => mod.CheckoutModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'negocio/perfil', loadChildren: () => import('./Negocio/Perfil/negocio.module').then(mod => mod.PerfilNegocioModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'negocio/usuarios', loadChildren: () => import('./Negocio/Usuarios/usuarios.module').then(mod => mod.UsuariosNegocioModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

      { path: 'negocio/usuario', loadChildren: () => import('./Negocio/Usuarios/usuario/usuario.module').then(mod => mod.UsuarioNegocioModule), data: {extraParameter: 'dashboardsMenu'}, canActivate: [AuthGuard] },

    ]

  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [
      { path: 'pages/login', loadChildren: () => import('./Seguridad/login/login.module').then(mod => mod.LoginModule), data: {extraParameter: ''} },
      { path: 'pages/registro', loadChildren: () => import('./Seguridad/registro/registro.module').then(mod => mod.RegistroModule), data: {extraParameter: ''} },
      { path: 'pages/recuperar', loadChildren: () => import('./Seguridad/recuperar/recuperar.module').then(mod => mod.RecuperarModule), data: {extraParameter: ''} },
      { path: 'pages/terminos', loadChildren: () => import('./Seguridad/terminos/terminos.module').then(mod => mod.TerminosModule), data: {extraParameter: ''} },
      { path: 'pages/ubicaciones', loadChildren: () => import('./Seguridad/Ubicaciones/ubicaciones.module').then(mod => mod.UbicacionesModule), data: {extraParameter: ''} }
    ]
  },
  // {
  //   path: '',
  //   component: AppsLayoutComponent,
  //   children: [
  //
  //     // Applications
  //
  //     {path: 'apps/chat', component: ChatComponent, data: {extraParameter: 'applicationsMenu'}},
  //     {path: 'apps/mailbox', component: MailboxComponent, data: {extraParameter: 'applicationsMenu'}},
  //     {path: 'apps/material-tabs', component: MaterialTabsComponent, data: {extraParameter: 'applicationsMenu'}},
  //   ]
  // },
  {path: '**', redirectTo: 'pages/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      useHash: true
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
