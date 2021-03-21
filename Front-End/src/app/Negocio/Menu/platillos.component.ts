import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Platillo } from '../../_models/platillo.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './platillos.component.html',
})
export class PlatillosComponent implements OnInit {

  heading = 'Artículos';
  subheading = 'Administración de los artículos';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  currentUser$: any;
  mainObject$ = new Platillo();
  mainArray$: any;
  platilloSeleccionado$: any;
  configuracion$ : any;
  isActive = false;
  index$ : any;

  constructor( private router: Router, private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private dataService : DataService, private modalService: NgbModal ){ }


  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
    }, (reason) => {
    });
  }

  nuevoRegistro(){

    this.mainObject$ = new Platillo();
    this.router.navigateByUrl('/administracion-negocio/platillo', { state: this.mainObject$ });

  }

  editarRegistro( registroEditar ){

    this.router.navigateByUrl('/administracion-negocio/platillo', { state: registroEditar });

  }

  seleccionarCategoria(index_t){
    this.index$ = index_t;
    for( var i = 0; i<this.mainArray$.length; i++ ){
      this.mainArray$[i].expand = false;
      this.mainArray$[i].platillos = [];
    }
    this.mainArray$[index_t].expand = true;
    this.dataService.useService( "get_platillos_by_categoria_id" , { data : this.mainArray$[index_t] } )
    .subscribe
      (
          (data : any) =>   {
            for( var i = 0; i<data.data.length; i++ ){
              if( data.data[i].promocion ){
                // data.data[i].calculado_descuento = (data.data[i].costo*100)/(100-data.data[i].promocion_total);
                // console.log(data.data[i]);
                data.data[i].calculado_descuento = data.data[i].costo;
                data.data[i].costo = data.data[i].costo - (data.data[i].costo*data.data[i].promocion_total)/100;
              }
            }
            this.mainArray$[index_t].platillos = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  borrarRegistro( mBorrar, registroBorrar ){

    this.mainObject$ = registroBorrar;
    this.modalReference = this.modalService.open(mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_empresa" , { data : this.mainObject$ } )
      .subscribe
        (
            (data : any) =>   {
              mainObject$ : new Platillo();
              this.dataService.generalAlert(data);
              this.getRegistros();
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }, (reason) => {
    });

  }

  getRegistros(){
    this.dataService.useService( "get_categorias_negocio_admin" , { data : this.currentUser$.negocio } )
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
  }

}
