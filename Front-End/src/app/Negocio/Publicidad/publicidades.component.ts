import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Publicidad } from '../../_models/publicidad.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './publicidades.component.html',
})
export class PublicidadesComponent implements OnInit {

  heading = 'Publicidades';
  subheading = 'Administración de las empresas';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;
  @ViewChild('mAcciones') mAcciones: TemplateRef<any>;

  modalReference: any;
  mainObject$ = new Publicidad();
  publicidad$ = new Publicidad();
  mainArray$: [];
  publicidadSeleccionado$: any;
  currentUser$ : any;
  isActive = false;
  searchText = "";
  servicio$ = "";

  isAdmin: any;
  isAdminNeg: any;

  constructor( private authenticationService: AuthenticationService, private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal ){ }

  accionesPublicidad( registro_t ){
    this.publicidad$ = registro_t;
    if( this.isAdmin ){
      this.modalReference = this.modalService.open(this.mAcciones);
    }
  }

  returnAccion( status_t ){
    this.dataService.useService( "actualizar_publicidad_estatus" , { data : { status : status_t, fecha : new Date() }, publicidad : this.publicidad$ } )
    .subscribe
      (
          (data : any) =>   {
            this.modalReference.close();
            this.dataService.generalAlert(data);
            this.getRegistros();
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("modal_closed");
    }, (reason) => {
      console.log("exit");
    });
  }

  nuevoRegistro(){

    this.mainObject$ = new Publicidad();
    this.router.navigateByUrl('/administracion-negocio/publicidad', { state: this.mainObject$ });

  }

  editarRegistro( registroEditar ){

    this.router.navigateByUrl('/administracion-negocio/publicidad', { state: registroEditar });

  }

  borrarRegistro( mBorrar, registroBorrar ){

    this.mainObject$ = registroBorrar;
    this.modalReference = this.modalService.open(mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_empresa" , { data : this.mainObject$ } )
      .subscribe
        (
            (data : any) =>   {
              mainObject$ : new Publicidad();
              this.dataService.generalAlert(data);
              this.getRegistros();
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }, (reason) => {
      console.log("exit");
    });

  }

  getRegistros(){
    this.dataService.useService( this.servicio$ , { negocio : this.currentUser$.negocio } )
    .subscribe
      (
          (data : any) =>   {
            this.mainArray$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {

    this.isAdmin = false;
    this.isAdminNeg = false;

    this.currentUser$ = this.authenticationService.currentUserValue;

    switch( this.currentUser$.tipo_usuario_id ){
      //Admin App
      case "5c4050f358209844a83c8622":
        this.isAdmin = true;
        this.servicio$ = "get_publicidades_admin";
      break;
      //Admin Neg
      case "5c4050fa58209844a83c8623":
        this.isAdminNeg = true;
        this.servicio$ = "get_publicidades_negocio";
      break;
    }

    this.getRegistros();

  }

}
