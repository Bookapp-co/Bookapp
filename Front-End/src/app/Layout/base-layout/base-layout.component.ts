import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef, Injectable, EventEmitter, Output   } from '@angular/core';
// import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {ConfigActions} from '../../ThemeOptions/store/config.actions';
import {ThemeOptions} from '../../theme-options';
import {animate, query, style, transition, trigger} from '@angular/animations';

import { Usuario } from '../../_models/usuario.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../../_services/authentication.service';
import { DataService } from '../../data.service';

console.log("Base Layout");

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  animations: [

    trigger('architectUIAnimation', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            opacity: 0,
            display: 'flex',
            flex: '1',
            transform: 'translateY(-20px)',
            flexDirection: 'column'

          }),
        ]),
        query(':enter', [
          animate('600ms ease', style({opacity: 1, transform: 'translateY(0)'})),
        ]),

        query(':leave', [
          animate('600ms ease', style({opacity: 0, transform: 'translateY(-20px)'})),
         ], { optional: true })
      ]),
    ])
  ]
})

export class BaseLayoutComponent {

  @ViewChild('mPedidosPendientes') mPedidosPendientes: TemplateRef<any>;
  @ViewChild('mMensajeGeneral') mMensajeGeneral: TemplateRef<any>;
  @ViewChild('mPromocion') mPromocion: TemplateRef<any>;

  pedidos1$               = [];
  pedidos2$               = [];
  classNotificacion$      = "notification-new-order";
  tipoNotificacion$       = 1;
  cantidadNotificacion$   = 1;
  mensajeNotificacion$    = "";
  modalOpened$            = false;
  mostrarIcono$           = false;
  mostrarImagen$          = false;
  urlImagen$              = false;
  promocion$              : any;
  currentUser$            : any;
  modalReference          : any;
  modalReference2         : any;
  ioConnection            : any;
  idInterval$             : any;
  showOverlay$            = true;

  tituloModal$  : any;
  mensajeModal$ : any;
  tipoModal$    : any;

  // @select('config') public config$: Observable<any>;

  constructor( private router: Router, private dataService : DataService, private authenticationService: AuthenticationService, private modalService: NgbModal, public globals: ThemeOptions, public configActions: ConfigActions) {

  }

  initIoConnection(){
    this.ioConnection = this.dataService.getPedidosPendientes()
    .subscribe((data: any) => {
      console.log("getPedidosPendientes");
      console.log(data);
      this.cantidadNotificacion$  = data.data.cantidad;
      this.mensajeNotificacion$   = data.data.mensaje;
      var tipo_t = data.data.tipo;
      if( tipo_t === 2 ){
        this.tipoNotificacion$  = 2;
        this.classNotificacion$ = "notification-pending-order";
      }else{
        this.tipoNotificacion$  = 1;
        this.classNotificacion$ = "notification-new-order";
      }
      if( !this.modalOpened$ ){
        this.runInterval();
        this.modalOpened$ = true;
        this.modalReference = this.modalService.open(this.mPedidosPendientes);
        this.modalReference.result.then((result) => {
          this.destroyInterval();
        }, (reason) => {
          this.destroyInterval();
          console.log("exit");
        });
      }
    });
  }

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }

  runInterval(){
    this.idInterval$ = setInterval(() => {
      var audio = new Audio();
      audio.src = "https://codigeek.com/projects/rivasgrill/desk_bell_x2.mp3";
      audio.load();
      audio.play();
    }, 5000);
  }

  destroyInterval(){
    this.modalOpened$ = false;
    if (this.idInterval$) {
      clearInterval(this.idInterval$);
    }
  }

  ngOnDestroy() {
    this.modalOpened$ = false;
    this.destroyInterval();
  }

  gestionarPedido(){
    this.modalOpened$ = false;
    if (this.idInterval$) {
      clearInterval(this.idInterval$);
    }
    console.log("GestionarPedido go..");
    this.modalReference.close();
    if( this.currentUser$.tipo_usuario_id === "5c40513258209844a83c8629" ){
      this.router.navigateByUrl('/pedidos/listado', { });      
    }else{
      this.router.navigateByUrl('/pedidos/admin', { });
    }
  }

  getRegistros(tipo_t){

    console.log("-------TIPO: " + tipo_t);

    this.currentUser$ = this.authenticationService.currentUserValue;

    this.pedidos1$ = [];

    console.log("baselayout get registros");
    console.log(this.currentUser$.tipo_usuario_id);
    if( this.currentUser$.tipo_usuario_id === "5c4050f358209844a83c8622" ||
        this.currentUser$.tipo_usuario_id === "5c4050fa58209844a83c8623" ||
        this.currentUser$.tipo_usuario_id === "5e30cadaec6ea3c622235f99" ||
        this.currentUser$.tipo_usuario_id === "5e30cae5ec6ea3c622235f9b"
      ){

        if( tipo_t === 2 ){
          this.tipoNotificacion$  = 2;
          this.classNotificacion$ = "notification-pending-order";
        }else{
          this.tipoNotificacion$  = 1;
          this.classNotificacion$ = "notification-new-order";
        }
        if( !this.modalOpened$ ){
          this.runInterval();
          this.modalOpened$ = true;
          this.modalReference = this.modalService.open(this.mPedidosPendientes);
          this.modalReference.result.then((result) => {
            this.destroyInterval();
          }, (reason) => {
            this.destroyInterval();
            console.log("exit");
          });
        }
      }
  }

  triggerMensajeGeneral(data){

    console.log("triggerMensajeGeneral");

    this.tituloModal$     = data.titulo;
    this.mensajeModal$    = data.mensaje;
    this.tipoModal$       = data.tipo;
    this.mostrarIcono$    = data.mostrar_icono;
    this.mostrarImagen$   = data.mostrar_imagen;
    this.urlImagen$       = data.url_imagen;

    this.modalReference = this.modalService.open(
      this.mMensajeGeneral,
      {windowClass: 'cgk-modal-full', backdrop: false}
    );
    this.modalReference.result.then((result) => {
    }, (reason) => {
      console.log("exit");
    });
  }

  closeModal(){
    this.modalReference.close();
  }

  getConfiguracion(){
    this.dataService.useService( "get_configuracion" , { } )
    .subscribe
      (
          (data : any) =>   {
            console.log("baselayout-configuracion");
            this.promocion$ = data.data[0];
            console.log(this.promocion$);
            if(this.promocion$.activar_promo_inicio){
              this.modalReference2 = this.modalService.open(this.mPromocion);
            }
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
    if( !this.currentUser$ ){
      this.currentUser$ = new Usuario();
    }else{
      if( this.currentUser$.tipo_usuario_id === "5c4050f358209844a83c8622" ||
          this.currentUser$.tipo_usuario_id === "5c4050fa58209844a83c8623" ||
          this.currentUser$.tipo_usuario_id === "5e30cadaec6ea3c622235f99" ||
          this.currentUser$.tipo_usuario_id === "5e30cae5ec6ea3c622235f9b"
        ){
          this.initIoConnection();
      }
    }
    setInterval(() => {
      if(!this.modalOpened$){
        if (this.idInterval$) {
          clearInterval(this.idInterval$);
        }
      }
    }, 3000);
  }

}
