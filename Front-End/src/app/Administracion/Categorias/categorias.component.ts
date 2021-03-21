import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from '../../_models/categoria.model';
import { Servicio } from '../../_models/servicio.model';
import { Especialidad } from '../../_models/especialidad.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent implements OnInit {

  heading = 'Categorias';
  subheading = 'Administración de las empresas';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') mBorrar: TemplateRef<any>;
  @ViewChild('mServicios') mServicios: TemplateRef<any>;
  @ViewChild('mEspecialidades') mEspecialidades: TemplateRef<any>;
  @ViewChild('mServicio') mServicio: TemplateRef<any>;
  @ViewChild('mEspecialidad') mEspecialidad: TemplateRef<any>;

  modalReference: any;
  mainObject$ = new Categoria();
  categoriaSeleccionada$ = new Categoria();
  servicio$ = new Servicio();
  especialidad$ = new Especialidad();
  mainArray$: [];
  servicios$ = [];
  especialidades$ = [];
  categoriaSeleccionado$: any;
  isActive = false;
  searchText = "";

  constructor( private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal ){ }

  verEspecialidades(){
    this.dataService.useService( "get_especialidades" , {  } )
    .subscribe
      (
        (data : any) =>   {
          this.especialidades$ = data.data;
          this.modalReference = this.modalService.open(this.mEspecialidades, { windowClass: 'modal-holder' } );
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  verServicios(registro_t){
    this.categoriaSeleccionada$ = registro_t;
    this.dataService.useService( "get_servicios_by_categoria" , { data : { categoria_id : registro_t._id } } )
    .subscribe
      (
        (data : any) =>   {
          this.servicios$ = data.data;
          this.modalReference = this.modalService.open(this.mServicios, { windowClass: 'modal-holder' } );
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  modalServicio( registro_t ){
    if( !registro_t ){
      this.servicio$ = new Servicio();
    }else{
      this.servicio$ = registro_t;
    }
    this.modalReference.close();
    this.modalReference = this.modalService.open(this.mServicio, { windowClass: 'modal-holder' } );
  }

  modalEspecialidad( registro_t ){
    if( !registro_t ){
      this.especialidad$ = new Especialidad();
    }else{
      this.especialidad$ = registro_t;
    }
    this.modalReference.close();
    this.modalReference = this.modalService.open(this.mEspecialidad, { windowClass: 'modal-holder' } );
  }

  returnServicio(){
    this.servicio$.categoria_id = this.categoriaSeleccionada$._id;
    if( !this.servicio$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre.", "status" : "error" } );
      return;
    }
    this.dataService.useService( "actualizar_servicio" , { data : this.servicio$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.modalReference.close();
            this.verServicios(this.categoriaSeleccionada$);
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  returnEspecialidad(){
    if( !this.especialidad$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre.", "status" : "error" } );
      return;
    }
    this.dataService.useService( "actualizar_especialidad" , { data : this.especialidad$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.modalReference.close();
            this.verEspecialidades();
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  eliminarEspecialidad( registro_t ){
    this.modalReference.close();
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_especialidad" , { data : registro_t } )
      .subscribe
        (
            (data : any) =>   {
              this.verEspecialidades();
              this.especialidad$ = new Especialidad();
              this.dataService.generalAlert(data);
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }, (reason) => {
      console.log("exit");
    });
  }

  eliminarServicio( registro_t ){
    this.modalReference.close();
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_servicio" , { data : registro_t } )
      .subscribe
        (
            (data : any) =>   {
              this.verServicios(this.categoriaSeleccionada$);
              this.servicio$ = new Servicio();
              this.dataService.generalAlert(data);
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
    this.dataService.useService( "get_categorias" , {  } )
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
    this.getRegistros();
  }

}
