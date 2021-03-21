import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons, NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Pedido } from '../../_models/pedido.model';
import { Configuracion } from '../../_models/configuracion.model';
import { Dashboard_Filtro } from '../../_models/dashboard_filtro.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import {animate, query, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './pedidos.component.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}],
  animations: [

    trigger('restaurantes', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ])
  ]
})
export class PedidosComponent implements OnInit {

  heading = 'Pedidos';
  subheading = "Consulta tu historial y seguimiento de pedidos";
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  mainObject$ = new Pedido();
  configuracion$ = new Configuracion();
  mainArray$ = [];
  pedidosEnCurso$ = [];
  pedidosCompletados$ = [];
  pedidoSeleccionado$: any;
  currentUser$ : any;
  ioConnection: any;

  // status$        = [10];
  status$        = [1,2];
  page$          = 1;
  pagRegistros$  = 0;
  pagParametros$ = {
		"limit" : 10,
		"skip" 	: 0
	};
  filtros$ = new Dashboard_Filtro();

  constructor( private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal, private authenticationService: AuthenticationService ){ }

  cambioTab(data){

    this.page$ = 1;
    this.pagRegistros$ = 0;
    this.pagParametros$ = {
  		"limit" : 10*this.page$,
  		"skip" 	: 10*(this.page$-1)
  	};
    this.mainArray$ = [];

    switch( data.index ){
      // case 0 :
      //   this.status$ = [ 10 ];
      // break;
      // case 1 :
      //   this.status$ = [ 1, 2 ];
      // break;
      // case 2 :
      //   this.status$ = [ 3 ];
      // break;
      // case 3 :
      //   this.status$ = [ 15 ];
      // break;
      case 0 :
        this.status$ = [ 1, 2 ];
      break;
      case 1 :
        this.status$ = [ 3 ];
      break;
      case 2 :
        this.status$ = [ 15 ];
      break;
    }
    this.getRegistros();
  }

  gestionarPedido( pedido_t ){
    this.router.navigateByUrl('/pedidos/pedido', { state: pedido_t });
  }

  regresar(){
    this.authenticationService.redireccionarUsuario(this.currentUser$);
  }

  initIoConnection(){
    console.log("initIoConnection");
    this.ioConnection = this.dataService.getPedidosPendientes()
    .subscribe((data: any) => {
      console.log("evento de socket recibido");
      this.getRegistros();
    });
  }

  agregarRegistros(){

    this.page$ = this.page$ + 1;

    this.pagParametros$ = {
      "limit" : 10*this.page$,
      "skip" 	: 10*(this.page$-1)
    };

    let servicio = "";
    switch( this.currentUser$.tipo_usuario_id ){
      //Admin App
      case "5c4050f358209844a83c8622":
        servicio = "get_pedidos_administracion";
      break;
      //Admin Neg - Place - Station - Restaurante
      case "5c4050fa58209844a83c8623":
      case "5e30cadaec6ea3c622235f99":
      case "5e30cadfec6ea3c622235f9a":
      case "5e30cae5ec6ea3c622235f9b":
        servicio = "get_pedidos_negocio";
      break;
      //Repartidor
      case "5c40513658209844a83c862a":
        servicio = "get_pedidos_motofast";
      break;
      //Cliente
      case "5c40513258209844a83c8629":
        servicio = "get_pedidos_usuario";
      break;
    }

    this.dataService.useService( servicio , { data : this.currentUser$, parametros : this.pagParametros$, condiciones : { status : this.status$ } } )
    .subscribe
      (
          (data : any) =>   {
            this.pagRegistros$ = data.total_registros;
            for( var i = 0; i<data.data.length; i++ ){
              this.mainArray$.push( data.data[i] );
            }
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );

  }

  limpiarFiltros(){
    this.filtros$ = new Dashboard_Filtro();
  }

  getRegistros(){

    if( this.filtros$.filtrar_por_fechas ){
      if( !this.filtros$.de_fecha ){
        this.dataService.generalAlert( { "message" : "Captura la fecha inicio.", "status" : "error" } );
        return;
      }
      if( !this.filtros$.hasta_fecha ){
        this.dataService.generalAlert( { "message" : "Captura la fecha fin.", "status" : "error" } );
        return;
      }
    }

    let servicio = "";
    switch( this.currentUser$.tipo_usuario_id ){
      //Admin App
      case "5c4050f358209844a83c8622":
        servicio = "get_pedidos_administracion";
      break;
      //Admin Neg - Place - Station - Restaurante
      case "5c4050fa58209844a83c8623":
      case "5e30cadaec6ea3c622235f99":
      case "5e30cadfec6ea3c622235f9a":
      case "5e30cae5ec6ea3c622235f9b":
        servicio = "get_pedidos_negocio";
      break;
      //Repartidor
      case "5c40513658209844a83c862a":
        servicio = "get_pedidos_motofast";
      break;
      //Cliente
      case "5c40513258209844a83c8629":
        servicio = "get_pedidos_usuario";
      break;
    }

    this.dataService.useService( servicio , { data : this.currentUser$, parametros : this.pagParametros$, condiciones : { status : this.status$ }, filtro : this.filtros$ } )
    .subscribe
      (
          (data : any) =>   {
            this.mainArray$    = data.data;
            this.pagRegistros$ = data.total_registros;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getConfiguracion(){
    this.dataService.useService( "get_configuracion" , {} )
    .subscribe
      (
          (data : any) =>   {
            this.configuracion$ = data.data[0];
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getRegistros();
    this.getConfiguracion();
    this.initIoConnection();
  }

}
