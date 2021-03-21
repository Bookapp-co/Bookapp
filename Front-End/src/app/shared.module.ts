import { NgModule } from '@angular/core';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TrendModule } from 'ngx-trend';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { PageTitleComponent } from './Layout/Components/page-title/page-title.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AgmCoreModule } from '@agm/core';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';


import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
// import {MatCheckboxModule, MatRippleModule, MatRadioModule, MatSlideToggleModule } from '@angular/material';

import { SeleccionarDireccionComponent } from './_modals/seleccionar-direccion.component';
import { SeleccionarImagenComponent } from './_modals/seleccionar-imagen.component';
import {UserBoxComponent} from './Layout/Components/header/elements/user-box/user-box.component';
import {MenuSidebarComponent} from './Seguridad/MenuSidebar/menu.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { ChartsModule } from 'ng2-charts';

//Directives
import {IfChangesDirective} from './_directives/if-changes.directive';
import {CopyClipboardDirective} from './_directives/copyclipboard.directive';

//Pipes
import { TruncatePipe } from './_pipes/limit.pipe';
import { PedidoPipe } from './_pipes/filter.pipe';
import { FilterPipe } from './_pipes/filterlist.pipe';

const config: SocketIoConfig = { url: 'https://codigeek.app/', options: {
  'reconnection delay': 1000,
	'reconnection limit': 1000,
	'max reconnection attempts': 'Infinity',
	'path' : '/bookapp/socket.io'
} };

@NgModule({
 declarations: [
   PageTitleComponent,
   SeleccionarDireccionComponent,
   SeleccionarImagenComponent,
   TruncatePipe,
   PedidoPipe,
   FilterPipe,
   IfChangesDirective,
   CopyClipboardDirective,
   UserBoxComponent,
   MenuSidebarComponent
 ],
 imports: [
   // AngularFontAwesomeModule,
   PerfectScrollbarModule,
   TrendModule,
   SelectDropDownModule,
   NgSelectModule,
   FormsModule,
   ReactiveFormsModule,
   NgbModule,
   ImageCropperModule,
   JwBootstrapSwitchNg2Module,

   AgmCoreModule.forRoot({
     apiKey: 'AIzaSyD8gOoDYkNxX966vjCQzNAIH2ZHKpkBql4',
     libraries: ["places"]
   }),

   MatCheckboxModule,
   MatRadioModule,
   MatTabsModule,
   MatTooltipModule,
   MatSlideToggleModule,
	 SocketIoModule.forRoot(config),
   ChartsModule
 ],
 exports: [
   // AngularFontAwesomeModule,
   PerfectScrollbarModule,
   TrendModule,
   SelectDropDownModule,
   NgSelectModule,
   FormsModule,
   ReactiveFormsModule,
   NgbModule,
   ImageCropperModule,
   JwBootstrapSwitchNg2Module,
   AgmCoreModule,
   MatCheckboxModule,
   MatRadioModule,
   MatTabsModule,
   MatTooltipModule,
   MatSlideToggleModule,
   SocketIoModule,

   PageTitleComponent,
   SeleccionarDireccionComponent,
   SeleccionarImagenComponent,
   TruncatePipe,
   PedidoPipe,
   FilterPipe,
   IfChangesDirective,
   CopyClipboardDirective,
   UserBoxComponent,
   MenuSidebarComponent,
   ChartsModule
 ]
})
export class SharedModule { }
