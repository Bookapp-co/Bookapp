import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Negocio } from '../../_models/negocio.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './sucursales.component.html',
})
export class SucursalesComponent implements OnInit {

  heading = 'Sucursales';
  subheading = 'Administración de las sucursales';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  modalReference2 : any;
  categoriasArray$ : any;
  mainObject$ = new Negocio();
  mainArray$: [];
  negocioSeleccionado$: any;
  currentUser$: any;
  isActive = false;
  searchText = "";

  @ViewChild('listadoCategorias') listadoCategorias: TemplateRef<any>;

  constructor( private authenticationService: AuthenticationService, private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal ){ }

  irACheckout(registro_t){
    this.router.navigateByUrl('/pedidos/checkout', { state : { negocio : registro_t } });
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

    this.router.navigateByUrl('/administracion/sucursal', { state: registroEditar });

  }

  validateEmpresa(){
    console.log(this.mainObject$);
    if( !this.mainObject$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre.", "status" : "error" } );
      return;
    }
    // Validar campos ---
    if(!this.mainObject$._id){
      delete this.mainObject$._id;
      this.dataService.useService( "nuev_sucursal" , { data : this.mainObject$, negocio : this.currentUser$.negocio } )
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
      this.dataService.useService( "actualizar_sucursal" , { data : this.mainObject$ } )
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

  getRegistros(){
    this.dataService.useService( "get_sucursales" , { data : this.currentUser$.negocio } )
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
