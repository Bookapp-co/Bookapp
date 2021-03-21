import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from '../../_models/categoria.model';
import { Buscador } from '../../_models/buscador.model';
import { Usuario } from '../../_models/usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent implements OnInit {

  heading = 'Reservas';
  subheading = 'Administra tu catálogo de reservas';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') mBorrar: TemplateRef<any>;
  @ViewChild('mSucursales') mSucursales: TemplateRef<any>;
  @ViewChild('mProfesionales') mProfesionales: TemplateRef<any>;
  @ViewChild('mDecoracion') mDecoracion: TemplateRef<any>;

  modalReference: any;
  currentUser$: any;
  mainObject$ = new Categoria();
  buscador$ = new Buscador();
  buscadorUsuario$ = new Usuario();
  mainArray$: any;
  sucursalesArray$ = [];
  peluquerosArray$ = [];
  categoriaSeleccionado$: any;
  mesa$: any;
  isActive = false;

  isAdmin: any;
  isAdminNeg: any;
  isMotofast: any;
  isClient: any;

  constructor( private router: Router, private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private dataService : DataService, private modalService: NgbModal ){ }

  getDecoraciones( registro_t ){
    this.mesa$ = registro_t;
    this.modalReference = this.modalService.open(this.mDecoracion);
    this.modalReference.result.then((result) => {
    },
    error =>  {
    })
  }

  seleccionarSucursal(){
    this.modalReference = this.modalService.open(this.mSucursales);
    this.modalReference.result.then((result) => {
      if( result === "General" ){
        this.buscador$._id    = "General";
        this.buscador$.nombre = "General";
        this.getRegistros();
      }else{
        this.buscador$ = result;
        if( this.currentUser$.negocio.categoria_id === '5ee410fe31a9c57966bf37c4' ){
          this.getProfesionales();
        }else{
          this.getRegistrosSucursal();
        }
      }
    }, (reason) => {
      console.log("exit");
    });
  }

  getProfesionales(){
    this.mainArray$ = [];
    this.buscadorUsuario$ = new Usuario();
    this.dataService.useService( "get_usuarios_sucursal_peluqueros" , { data : this.buscador$ } )
    .subscribe
      (
        (data : any) =>   {
          this.peluquerosArray$ = data.data;
          this.modalReference = this.modalService.open(this.mProfesionales);
          this.modalReference.result.then((result) => {
            this.buscadorUsuario$ = result;
            this.getRegistrosSucursalProfesional();
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
        )
      }
    );
  }

  getProfesionalesSucursal(){
    this.mainArray$ = [];
    this.buscadorUsuario$ = new Usuario();
    this.dataService.useService( "get_usuarios_sucursal_peluqueros" , { data : this.buscador$ } )
    .subscribe
      (
        (data : any) =>   {
          this.peluquerosArray$ = data.data;
          this.modalReference = this.modalService.open(this.mProfesionales);
          this.modalReference.result.then((result) => {
            this.buscadorUsuario$ = result;
            this.getRegistrosSucursalProfesional();
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
        )
      }
    );
  }

  nuevoRegistro(){
    this.mainObject$ = new Categoria();
    if( this.buscador$._id === "General" ){
      this.router.navigateByUrl('/administracion-negocio/categoria', {
        state: {
          categoria : this.mainObject$,
          negocio   : this.currentUser$.negocio,
          main      : true
        }
      });
    }else{
      this.router.navigateByUrl('/administracion-negocio/categoria', {
        state: {
          categoria : this.mainObject$,
          negocio   : this.buscador$,
          peluquero   : this.buscadorUsuario$,
          main      : false
        }
      });
    }
  }

  editarRegistro( registroEditar ){
    this.mainObject$ = new Categoria();
    if( this.buscador$._id === "General" ){
      this.router.navigateByUrl('/administracion-negocio/categoria', {
        state: {
          categoria : registroEditar,
          negocio   : this.currentUser$.negocio,
          main      : true
        }
      });
    }else{
      this.router.navigateByUrl('/administracion-negocio/categoria', {
        state: {
          categoria : registroEditar,
          negocio   : this.buscador$,
          main      : false
        }
      });
    }
  }

  borrarRegistro( registro_t ){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_categoria_negocio" , { data : registro_t } )
      .subscribe
        (
            (data : any) =>   {
              if( this.currentUser$.negocio.categoria_id === '5ee410fe31a9c57966bf37c4' ){
                this.getRegistrosSucursalProfesional();
              }else{
                this.getRegistrosSucursal();
              }
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
    this.dataService.useService( "get_categorias_negocio" , { data : this.currentUser$.negocio } )
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

  getRegistrosSucursal(){
    this.dataService.useService( "get_categorias_negocio" , { data : this.buscador$ } )
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

  getRegistrosSucursalProfesional(){
    this.dataService.useService( "get_categorias_negocio_peluqueros" , { data : this.buscador$, usuario : this.buscadorUsuario$ } )
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

  getSucursales(){
    this.dataService.useService( "get_sucursales" , { data : this.currentUser$.negocio } )
    .subscribe
      (
          (data : any) =>   {
            this.sucursalesArray$ = data.data;
            if( data.data.length === 0 ){
              this.dataService.generalAlert({ status : "success", message : "Primero debes de crear una sucursal" });
              this.authenticationService.setCurrentMenuIndex(6);
              this.router.navigateByUrl('/administracion/sucursales');
              return;
            }
            this.buscador$ = data.data[0];
            if( this.currentUser$.negocio.categoria_id === '5ee410fe31a9c57966bf37c4' ){
              this.getProfesionales();
            }else{
              this.getRegistrosSucursal();
            }
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  consultarPeluqueros(){
    if( this.currentUser$.negocio.main ){
      this.getProfesionales();
    }else{
      this.getProfesionalesSucursal();
    }
  }

  ngOnInit() {

    this.currentUser$     = this.authenticationService.currentUserValue;

    this.isAdmin = false;
    this.isAdminNeg = false;
    this.isMotofast = false;
    this.isClient = false;

    switch( this.currentUser$.negocio.categoria_id ){
      case "5ee410ec31a9c57966bf37c3":
        this.heading = "Canchas";
      break;
      case "5ee410fe31a9c57966bf37c4":
        this.heading = "Servicios";
      break;
      case "5ee4110b31a9c57966bf37c5":
        this.heading = "Mesas";
      break;
      case "5ee410dc31a9c57966bf37c2":
        this.heading = "Servicios de mis especialidades";
      break;
    }

    switch( this.currentUser$.tipo_usuario_id ){
      //Admin App
      case "5c4050f358209844a83c8622":
        this.isAdmin = true;
      break;
      //Admin Neg
      case "5c4050fa58209844a83c8623":
        this.isAdminNeg = true;
      break;
      //Repartidor
      case "5c40513658209844a83c862a":
        this.isMotofast = true;
      break;
      //Cliente
      case "5c40513258209844a83c8629":
        this.isClient = true;
      break;
    }

    if( this.currentUser$.negocio.main){
      this.getSucursales();
    }else{
      this.buscador$ = this.currentUser$.negocio;
      if( this.currentUser$.negocio.categoria_id === "5ee410fe31a9c57966bf37c4" ){
        this.getProfesionalesSucursal();
      }else{
        this.getRegistrosSucursal();
      }
    }


  }

}
