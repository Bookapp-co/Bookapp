import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { User } from './_models/user.model';
import { Module } from './module.model';
import { DataService } from './data.service';
import { AuthenticationService } from './_services/authentication.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare let PushNotification: any;

import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {

  users$: User[];
  modules$: Module[];
  currentUser$: any;
  title = 'Delivery';
  registrationId = '';

  classNotificacion$      = "notification-new-order";
  tipoNotificacion$       = 1;
  cantidadNotificacion$   = 1;
  mensajeNotificacion$    = "";
  modalOpened$            = false;
  mostrarIcono$           = false;
  mostrarImagen$          = false;
  urlImagen$              = false
  modalReference          : any;
  modalReference2         : any;
  showOverlay$            = true;
  promocion$              : any;

  tituloModal$  : any;
  mensajeModal$ : any;
  tipoModal$    : any;

  @ViewChild('mMensajeGeneral') mMensajeGeneral: TemplateRef<any>;
  @ViewChild('mPromocion') mPromocion: TemplateRef<any>;

  constructor(
    private socket: Socket,
    private authenticationService: AuthenticationService,
    private router: Router,
    private dataService : DataService,
    private modalService: NgbModal,
  ){
    this.dataService.getModalData().subscribe(data => { this.triggerMensajeGeneral(data); });
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
    if(this.currentUser$){
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
  }

  ngOnInit(){
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.authenticationService.setRegistrationID(this.registrationId);
    this.authenticationService.setUser(this.currentUser$);
    if(this.currentUser$){
      this.authenticationService.watchUserPosition(this.currentUser$);
    }
    setTimeout(() => {
      console.log('hide');
      this.showOverlay$ = false;
    }, 3000);

    this.getConfiguracion();

    let push = PushNotification.init({
        android: {
            senderID: "100470118971",
            icon: 'logo_business.png',
            iconColor: '#f9d001',
            "forceShow": "true"
        },
        ios: {
            alert: "true",
            badge: false,
            sound: "true"
        },
        windows: {}
    });
    push.on('registration', data => {

      console.log("registrationID----PUSHNOTIFICATION");
      console.log(data.registrationId);
      console.log(this.currentUser$);

      this.authenticationService.setRegistrationID(data.registrationId);

      if (this.currentUser$) {
          if (this.currentUser$._id) {
              this.currentUser$.registrationId = data.registrationId;
              this.dataService.useService("actualizar_registration_id", { data: this.currentUser$ })
                  .subscribe(function (data) {
              }, function (error) {
              });
          }
      }
    });

    push.on('notification', data => {
      console.log("not recibida");
      var propValue;
      for(var propName in data) {
          propValue = data[propName]

          console.log(propName,propValue);
      }
    });
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['pages/login']);
  }

}
