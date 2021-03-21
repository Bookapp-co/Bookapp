/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Publicidad } from '../../../_models/publicidad.model';
import { Tarjeta } from '../../../_models/tarjeta.model';
import { Configuracion } from '../../../_models/configuracion.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';

@Component({
  selector: 'publicidad-acceso',
  templateUrl: './publicidad.component.html',
})

export class PublicidadComponent implements OnInit {

  mainObj$ = new Publicidad();
  mainObjParam$ = new Publicidad();
  configuracion$ = new Configuracion();
  tarjetaObject$ = new Tarjeta();
  mainArray$: [];
  tarjetas$ = [];
  currentUser$ : any;
  modalReference: any;

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
  @ViewChild('mBorrar') mBorrar: TemplateRef<any>;
  @ViewChild('mTipoPago') mTipoPago: TemplateRef<any>;
  @ViewChild('mTarjetas') mTarjetas: TemplateRef<any>;
  @ViewChild('mNuevaTarjeta') mNuevaTarjeta: TemplateRef<any>;

  constructor( private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  nuevaTarjeta(){
    this.modalReference.close();
    this.modalReference = this.modalService.open(this.mNuevaTarjeta, { windowClass: 'modal-holder' } );
  }

  returnTarjeta( opcion_t ){
    this.mainObj$.tarjeta     = opcion_t;
    this.mainObj$.tarjeta_id  = opcion_t.id;
    this.modalReference.close();
  }

  guardarTarjeta(){
    if( !this.tarjetaObject$.number ){
      this.dataService.generalAlert( { "message" : "Completar número de tarjeta", "status" : "info" } );
      return;
    }
    if( !this.tarjetaObject$.exp_month ){
      this.dataService.generalAlert( { "message" : "Completar mes de expiración", "status" : "info" } );
      return;
    }
    if( !this.tarjetaObject$.exp_year ){
      this.dataService.generalAlert( { "message" : "Completar año de expiración", "status" : "info" } );
      return;
    }
    if( !this.tarjetaObject$.cvc ){
      this.dataService.generalAlert( { "message" : "Completar CVC", "status" : "info" } );
      return;
    }
    this.dataService.useService( "guardar_tarjeta" , { data : this.currentUser$, tarjeta : this.tarjetaObject$ } )
    .subscribe
      (
        (data : any) =>   {
          if( data.error ){
            this.dataService.generalAlert({ "status" : "error", "message" : data.error.message });
          }
          if( data.status === "success" ){
          this.modalReference.close();
            this.dataService.generalAlert(data);
            this.seleccionarTarjeta();
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  seleccionarTarjeta(){
    this.dataService.useService( "get_usuario_tarjetas" , { data : this.currentUser$ } )
    .subscribe
      (
        (data : any) =>   {
          console.log(data);
          if( data.status === "success" ){
            if( data.data ){
              this.tarjetas$ = data.data;
            }else{
              this.tarjetas$ = [];
            }
            console.log("tarjetas");
            console.log(this.tarjetas$);
            this.modalReference = this.modalService.open(this.mTarjetas, { windowClass: 'modal-holder' } );
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  regresar(){
    this.router.navigateByUrl('/administracion-negocio/publicidades', { });
  }

  borrar(){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_publicidad" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/administracion-negocio/publicidades', { });
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
    if( !this.mainObj$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.foto ){
      this.dataService.generalAlert( { "message" : "Completa la imagen de la categoría.", "status" : "error" } );
      return;
    }
    this.dataService.useService( "actualizar_publicidad" , { data : this.mainObj$, negocio : this.currentUser$.negocio } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/administracion-negocio/publicidades', { });
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
    console.log("Param on init publicidad");
    console.log(history.state);
    if( history.state._id ){
      this.mainObj$ = history.state;
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getConfiguracion();
  }

}
