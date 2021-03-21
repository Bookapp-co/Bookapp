/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Configuracion } from '../../_models/configuracion.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';

@Component({
  selector: 'configuracion-acceso',
  templateUrl: './configuracion.component.html',
})

export class ConfiguracionComponent implements OnInit {

  mainObj$            = new Configuracion();
  mainObjParam$       = new Configuracion();
  tipoMoneda$         = [];
  currentUser$        : any;
  modalReference      : any;
  modalReference2     : any;

  archivo1$           : any;
  archivo2$           : any;

  public imagePath;
  imgURL              : any;
  public isActive     : any;

  // Cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;

  @ViewChild('mBorrar') mBorrar: TemplateRef<any>;
  @ViewChild('mTipoMoneda') mTipoMoneda: TemplateRef<any>;
  @ViewChild('mImagen') templateSubirImagen: TemplateRef<any>;

  constructor( private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  irATiempos(){
    this.router.navigateByUrl('/administracion/tiempos', { });
  }

  terminosArchivoFile(event: any): void {
     this.mainObj$.terminos_archivo  = event.target.files[0];
     this.archivo1$ = event.target.files[0];
  }

  subirImagen( ){
    this.open(this.templateSubirImagen);
  }

  politicasArchivoFile(event: any): void {
     this.mainObj$.politicas_archivo = event.target.files[0];
     this.archivo2$ = event.target.files[0];
  }

  guardarImagen(){
    this.mainObj$.foto = this.croppedImage;
    this.modalReference.close();
  }

  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("modal_closed");
    }, (reason) => {
      console.log("exit");
    });
  }

  abrirArchivo(url_t){
    window.open(url_t, "_system");
  }

  seleccionarTipoMoneda(){
    this.dataService.useService( "get_tipo_moneda" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.tipoMoneda$ = data.data;
            this.modalReference2 = this.modalService.open(this.mTipoMoneda);
            this.modalReference2.result.then((result) => {
              this.mainObj$.tipo_de_moneda    = result;
              this.mainObj$.tipo_de_moneda_id = result._id;
            }, (reason) => {
              console.log("exit");
            });
          },
          error =>  {
            alert("Error");
          }
    );
  }

  getConfiguracion(){
    this.dataService.useService( "get_configuracion" , {} )
    .subscribe
      (
          (data : any) =>   {
            this.mainObj$ = data.data[0];
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  guardar(){
    if(this.mainObj$.terminos_archivo){
      this.mainObj$.terminos_archivo_url  = "https://codigeek.app/bookapp/uploads/" + this.archivo1$.name;
      this.dataService.guardarArchivo( this.mainObj$.terminos_archivo );
    }
    if(this.mainObj$.politicas_archivo){
      this.mainObj$.politicas_archivo_url = "https://codigeek.app/bookapp/uploads/" + this.archivo2$.name;
      this.dataService.guardarArchivo( this.mainObj$.politicas_archivo );
    }
    this.dataService.useService( "actualizar_configuracion" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getConfiguracion();
  }

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

}
