import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ayuda } from '../../_models/ayuda.model'; 
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './ayuda.component.html',
})
export class AyudaComponent implements OnInit {

  heading = 'Ayuda';
  subheading = 'Administración de sistemas de ayuda';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  mainObject$ = new Ayuda();
  mainArray$ = [];
  puntoSeleccionado$: any;
  isActive = false;
  currentUser$ : any;
  whatsapp$ : any;

  constructor( private authenticationService: AuthenticationService, private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal ){ }

  regresar(){
    this.authenticationService.redireccionarUsuario(this.currentUser$);
  }

  enviarMensaje(){
    window.open(
      "https://api.whatsapp.com/send?phone=" + this.whatsapp$,
      "_system"
    );
  }

  guardarAyuda(){
    if( !this.mainObject$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre.", "status" : "error" } );
      return;
    }
    if( !this.mainObject$.correo ){
      this.dataService.generalAlert( { "message" : "Completa el correo.", "status" : "error" } );
      return;
    }
    if( !this.mainObject$.asunto ){
      this.dataService.generalAlert( { "message" : "Completa el asunto.", "status" : "error" } );
      return;
    }
    this.dataService.useService( "enviar_ayuda" , { data : this.currentUser$, ayuda : this.mainObject$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            if( data.status === "success" ){
              this.authenticationService.redireccionarUsuario(this.currentUser$);
            }
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getWhatsapp(){
    this.dataService.useService( "get_whatsapp" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.whatsapp$ = data.data[0].telefono;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getWhatsapp();
  }

}
