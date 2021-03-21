/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Usuario } from '../../../_models/usuario.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';

@Component({
  selector: 'usuario-acceso',
  templateUrl: './usuario.component.html',
})

export class UsuarioComponent implements OnInit {

  mainObj$ = new Usuario();
  mainObjParam$ = new Usuario();
  mainArray$: [];
  sucursalesArray$: [];
  tiposArray$: [];
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
  @ViewChild('listadoTipos') listadoTipos: TemplateRef<any>;
  @ViewChild('mSucursales') mSucursales: TemplateRef<any>;

  constructor( private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  seleccionarSucursal(){
    this.dataService.useService( "get_sucursales" , { data : this.currentUser$.negocio } )
    .subscribe
      (
          (data : any) =>   {
            this.sucursalesArray$ = data.data;
            this.modalReference = this.modalService.open(this.mSucursales);
            this.modalReference.result.then((result) => {
              this.mainObj$.sucursal = result;
              this.mainObj$.sucursal_id = result._id;
            }, (reason) => {
              console.log("exit");
            });
          },
          error =>  {
            alert("Error");
          }
    );
  }

  seleccionarTipo(){
    console.log("seleccionartipo2");
    this.dataService.useService( "get_tipos_usuario_negocio" , { negocio : this.currentUser$.negocio } )
    .subscribe
      (
          (data : any) =>   {
            this.tiposArray$ = data.data;
            console.log(this.tiposArray$);
            this.modalReference = this.modalService.open(this.listadoTipos);
            this.modalReference.result.then((result) => {
              this.mainObj$.tipo_usuario = result;
              this.mainObj$.tipo_usuario_id = result._id;
            }, (reason) => {
              console.log("exit");
            });
          },
          error =>  {
            alert("Error");
          }
    );
  }

  borrar(){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_usuario" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/negocio/usuarios', { });
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
    if( !this.mainObj$.telefono ){
      this.dataService.generalAlert( { "message" : "Completa el teléfono.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.correo ){
      this.dataService.generalAlert( { "message" : "Completa el correo.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.contrasena ){
      this.dataService.generalAlert( { "message" : "Completa la contraseña.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.tipo_usuario_id ){
      this.dataService.generalAlert( { "message" : "Completa el tipo de usuario.", "status" : "error" } );
      return;
    }
    if( this.mainObj$.tipo_usuario_id === '5c40513658209844a83c862a' ){
      if( !this.mainObj$.sucursal ){
        this.dataService.generalAlert( { "message" : "Completa la sucursal.", "status" : "error" } );
        return;
      }
    }
    this.mainObj$.negocio_id = this.currentUser$.negocio._id;
    this.dataService.useService( "actualizar_usuario_negocio" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            if( data.status === "success" ){
              this.router.navigateByUrl('/negocio/usuarios', { });
            }
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

  ngOnInit() {
    console.log("Param on init usuario");
    console.log(history.state);
    if( history.state._id ){
      this.mainObj$ = history.state;
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
  }

}
