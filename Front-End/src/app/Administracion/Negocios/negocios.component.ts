import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Negocio } from '../../_models/negocio.model';
import { Filtro_Negocio } from '../../_models/filtro_negocio.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './negocios.component.html',
})
export class NegociosComponent implements OnInit {

  heading = 'Negocios';
  subheading = 'Administración de las empresas';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  modalReference2 : any;
  currentUser$ : any;
  categoriasArray$ : any;
  mainObject$ = new Negocio();
  filtroNegocio$ = new Filtro_Negocio();
  mainArray$: [];
  negocioSeleccionado$: any;
  isActive = false;
  searchText = "";

  @ViewChild('listadoCategorias') listadoCategorias: TemplateRef<any>;

  constructor( private authenticationService: AuthenticationService, private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal ){ }

  abrirUbicacion(){
    this.router.navigate(['pages/ubicaciones'], { state : { regresar : '/administracion/negocios' } });
  }

  triggerStatus(negocio_t){
    this.dataService.useService( "actualizar_estatus_negocio" , { data : negocio_t } )
    .subscribe
      (
          (data : any) =>   {
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

    this.mainObject$ = new Negocio();
    this.open(this.templateEditarRegistro);

  }

  editarRegistro( registroEditar ){

    this.router.navigateByUrl('/administracion/negocio', { state: registroEditar });

  }

  borrarRegistro( mBorrar, registroBorrar ){

    this.mainObject$ = registroBorrar;
    this.modalReference = this.modalService.open(mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_empresa" , { data : this.mainObject$ } )
      .subscribe
        (
            (data : any) =>   {
              mainObject$ : new Negocio();
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

  validateEmpresa(){
    console.log(this.mainObject$);
    if( !this.mainObject$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre.", "status" : "error" } );
      return;
    }
    if( !this.mainObject$.categoria ){
      this.dataService.generalAlert( { "message" : "Completa la categoría.", "status" : "error" } );
      return;
    }
    // Validar campos ---
    if(!this.mainObject$._id){
      delete this.mainObject$._id;
      this.dataService.useService( "nuev_negocio" , { data : this.mainObject$ } )
      .subscribe
        (
            (data : any) =>   {
              mainObject$ : new Negocio();
              this.modalReference.close();
              this.dataService.generalAlert(data);
              this.getRegistros();
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }else{
      this.dataService.useService( "actualizar_negocio" , { data : this.mainObject$ } )
      .subscribe
        (
            (data : any) =>   {
              mainObject$ : new Negocio();
              this.modalReference.close();
              this.dataService.generalAlert(data);
              this.getRegistros();
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }
  }

  limpiarFiltros(){
    this.filtroNegocio$ = new Filtro_Negocio();
  }

  seleccionarCategoriaFiltro(){
    this.dataService.useService( "get_categorias" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.categoriasArray$ = data.data;
            this.modalReference2 = this.modalService.open(this.listadoCategorias);
            this.modalReference2.result.then((result) => {
              this.filtroNegocio$.categoria = result;
              this.filtroNegocio$.categoria_id = result._id;
            }, (reason) => {
              console.log("exit");
            });
          },
          error =>  {
            alert("Error");
          }
    );
  }

  seleccionarCategoria(){
    this.dataService.useService( "get_categorias" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.categoriasArray$ = data.data;
            this.modalReference2 = this.modalService.open(this.listadoCategorias);
            this.modalReference2.result.then((result) => {
              this.mainObject$.categoria = result;
              this.mainObject$.categoria_id = result._id;
            }, (reason) => {
              console.log("exit");
            });
          },
          error =>  {
            alert("Error");
          }
    );
  }

  getRegistros(){
    if(this.filtroNegocio$.ubicacion){
      if( !this.currentUser$.latitude ){
        this.dataService.generalAlert( { "message" : "Captura la ubicación.", "status" : "error" } );
        return;
      }
      this.filtroNegocio$.latitude  = this.currentUser$.latitude;
      this.filtroNegocio$.longitude = this.currentUser$.longitude;
      this.filtroNegocio$.direccion = this.currentUser$.direccion;
    }
    this.dataService.useService( "get_negocios" , { filtro : this.filtroNegocio$ } )
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
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getRegistros();
  }

}
