/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Categoria } from '../../../_models/categoria.model';
import { Negocio } from '../../../_models/negocio.model';
import { Usuario } from '../../../_models/usuario.model';
import { Precio_Decoracion } from '../../../_models/precio_decoracion.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';

@Component({
  selector: 'categoria-acceso',
  templateUrl: './categoria.component.html',
})

export class CategoriaComponent implements OnInit {

  mainObj$            = new Categoria();
  mainObjParam$       = new Categoria();
  negocioObj$         = new Negocio();
  peluquero$          = new Usuario();
  precioDecoracion$   = new Precio_Decoracion();
  mainArray$          : any;
  tiemposArray$       : any;
  serviciosArray$     : any;
  currentUser$        : any;
  modalReference      : any;
  especialidades$     : any;

  isCancha      = false;
  isRestaurante = false;
  isPeluqueria  = false;
  isMedico      = false;
  isMain        = false;

  public imagePath;
  imgURL: any;
  public isActive: any;

  // Cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  @ViewChild('mImagen') templateSubirImagen: TemplateRef<any>;
  @ViewChild('mImagenPromocion') mImagenPromocion: TemplateRef<any>;
  @ViewChild('mBorrar') mBorrar: TemplateRef<any>;
  @ViewChild('mTiempos') mTiempos: TemplateRef<any>;
  @ViewChild('mServicios') mServicios: TemplateRef<any>;
  @ViewChild('mEspecialidades') mEspecialidades: TemplateRef<any>;

  constructor( private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  subirImagenPromocion(){
    this.modalReference = this.modalService.open(this.mImagenPromocion);
  }

  guardarImagenPromocion(){
    this.mainObj$.foto_promocion = this.croppedImage;
    this.modalReference.close();
  }

  agregarPrecioDecoracion(){
    this.mainObj$.precio_decoracion.push( new Precio_Decoracion() );
    this.mainObj$.precio_decoracion.push( new Precio_Decoracion() );
  }

  borrarPrecioDecoracion( index_t ){
    this.mainObj$.precio_decoracion.splice( index_t,1 );
  }

  seleccionarServicio(){
    this.dataService.useService( "get_servicios_by_categoria" , { data : this.currentUser$.negocio } )
    .subscribe
      (
        (data : any) =>   {
          this.serviciosArray$ = data.data;
          this.modalReference = this.modalService.open(this.mServicios);
          this.modalReference.result.then((result) => {
            this.mainObj$.servicio    = result;
            this.mainObj$.servicio_id = result._id;
          }, (reason) => {
            console.log("exit");
          });
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  seleccionarTiempo1(){
    this.dataService.useService( "get_tiempos_hora" , { data : this.currentUser$.negocio } )
    .subscribe
      (
        (data : any) =>   {
          this.tiemposArray$ = data.data;
          this.modalReference = this.modalService.open(this.mTiempos);
          this.modalReference.result.then((result) => {
            this.mainObj$.tiempo    = result;
            this.mainObj$.tiempo_id = result._id;
          }, (reason) => {
            console.log("exit");
          });
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  seleccionarTiempo2(){
    this.dataService.useService( "get_tiempos_minuto_por_negocio" , { data : this.currentUser$.negocio } )
    .subscribe
      (
        (data : any) =>   {
          this.tiemposArray$ = data.data;
          this.modalReference = this.modalService.open(this.mTiempos);
          this.modalReference.result.then((result) => {
            this.mainObj$.tiempo_alquilacion     = result;
            this.mainObj$.tiempo_alquilacion_id  = result._id;
          }, (reason) => {
            console.log("exit");
          });
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  seleccionarTiempo3(){
    this.dataService.useService( "get_tiempos_minuto_tolerancia" , { data : this.currentUser$.negocio } )
    .subscribe
      (
        (data : any) =>   {
          this.tiemposArray$ = data.data;
          this.modalReference = this.modalService.open(this.mTiempos);
          this.modalReference.result.then((result) => {
            this.mainObj$.tiempo_tolerancia     = result;
            this.mainObj$.tiempo_tolerancia_id  = result._id;
          }, (reason) => {
            console.log("exit");
          });
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  borrar(){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_categoria_negocio" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/administracion-negocio/categorias', { });
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }, (reason) => {
      console.log("exit");
    });
  }

  guardar(){
    if( !this.mainObj$.tiempo_id ){
      this.dataService.generalAlert( { "message" : "Completa el tiempo de anticipación.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.tiempo_alquilacion_id ){
      this.dataService.generalAlert( { "message" : "Completa el tiempo de la cita.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.tiempo_tolerancia_id ){
      this.dataService.generalAlert( { "message" : "Completa el tiempo de tolerancia.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.servicio_id ){
      this.dataService.generalAlert( { "message" : "Captura el tipo de cita.", "status" : "error" } );
      return;
    }
    if( this.isMedico ){
      if( !this.mainObj$.especialidad_id ){
        this.dataService.generalAlert( { "message" : "Captura la especialidad.", "status" : "error" } );
        return;
      }
    }
    if( !this.mainObj$.costo ){
      if( !(this.negocioObj$.categoria_id === '5ee4110b31a9c57966bf37c5') ){
        this.dataService.generalAlert( { "message" : "Completa el precio.", "status" : "error" } );
        return;
      }
    }
    if( this.mainObj$.promocion ){
      if( this.mainObj$.aplica_porcentaje ){
        if( !this.mainObj$.porcentaje_descuento ){
          this.dataService.generalAlert( { "message" : "Completa el porcentaje de descuento.", "status" : "error" } );
          return;
        }
      }else{
        if( !this.mainObj$.detalle_promocion ){
          this.dataService.generalAlert( { "message" : "Completa el detalle del descuento.", "status" : "error" } );
          return;
        }
      }
    }
    if( this.mainObj$.anticipo ){
      if( !this.mainObj$.anticipo_cantidad ){
        this.dataService.generalAlert( { "message" : "Completa el anticipo.", "status" : "error" } );
        return;
      }
    }
    if( this.mainObj$.decoracion === 1 ){
      if( this.mainObj$.precio_decoracion.length === 0 ){
        this.dataService.generalAlert( { "message" : "Completa el precio de la decoración.", "status" : "error" } );
        return;
      }
    }
    this.mainObj$.negocio_id = this.negocioObj$._id;
    if( this.negocioObj$.categoria_id === '5ee410fe31a9c57966bf37c4' ){
      this.mainObj$.usuario_id = this.peluquero$._id;
    }
    this.dataService.useService( "actualizar_categoria_negocio" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/administracion-negocio/categorias', { });
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }


  // MODALS - IMAGES

  guardarImagen(){
    this.mainObj$.foto = this.croppedImage;
    this.modalReference.close();
  }

  subirImagen( ){
    this.open(this.templateSubirImagen);
  }

  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("modal_closed");
    }, (reason) => {
      console.log("exit");
    });
  }

  // MODALS - IMAGES

  //Cropper
  fileChangeEvent(event: any): void {
    console.log("file changed");
    console.log("event");
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event);
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    // this.imageCropper.rotateLeft();
  }

  rotateRight() {
    // this.imageCropper.rotateRight();
  }

  flipHorizontal() {
    // this.imageCropper.flipHorizontal();
  }

  flipVertical() {
    // this.imageCropper.flipVertical();
  }

  //Cropper

  seleccionarEspecialidad(){
    this.dataService.useService( "get_especialidades_negocio" , { data : this.negocioObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.especialidades$ = [];
          for( var i = 0; i<data.data.length; i++ ){
            this.especialidades$.push(
              data.data[i].especialidad
            );
          }
          console.log(this.especialidades$);
          this.modalReference = this.modalService.open(this.mEspecialidades);
          this.modalReference.result.then((result) => {
            this.mainObj$.especialidad    = result;
            this.mainObj$.especialidad_id = result._id;
          }, (reason) => {
            console.log("exit");
          });
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  ngOnInit() {

    console.log(history.state);

    this.mainObj$      = history.state.categoria;
    this.isMain        = history.state.main;
    this.negocioObj$   = history.state.negocio;
    this.peluquero$   = history.state.peluquero;

    console.log(this.negocioObj$);

    this.isCancha      = false;
    this.isRestaurante = false;
    this.isPeluqueria  = false;
    this.isMedico      = false;

    this.currentUser$ = this.authenticationService.currentUserValue;
    switch( this.currentUser$.negocio.categoria_id ){
      case "5ee410ec31a9c57966bf37c3":
        this.isCancha = true;
      break;
      case "5ee4110b31a9c57966bf37c5":
        this.isRestaurante = true;
      break;
      case "5ee410fe31a9c57966bf37c4":
        this.isPeluqueria = true;
      break;
      case "5ee410dc31a9c57966bf37c2":
        this.isMedico = true;
      break;
    }

  }

}
