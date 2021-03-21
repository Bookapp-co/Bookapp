/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Usuario } from '../../_models/usuario.model';
import { NgbTabset, NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import { MapsAPILoader } from '@agm/core';
declare let google: any;

@Component({
  selector: 'perfil-acceso',
  templateUrl: './perfil.component.html',
})

export class PerfilComponent implements OnInit {

  mainObj$        = new Usuario();
  currentUser$    : any;
  modalReference  : any;
  modalReference2 : any;

  @ViewChild('mImagen') mImagen           : TemplateRef<any>;
  @ViewChild('mContrasena') mContrasena   : TemplateRef<any>;

  // Cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;

  constructor(
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService : DataService ,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal ){
  }

  regresar(){
    this.authenticationService.redireccionarUsuario(this.currentUser$);
  }

  abrirCambiarContrasena(){
    this.modalReference2 = this.modalService.open(this.mContrasena);
  }

  guardarContrasena(){
    if( !this.currentUser$.contrasena_actual ){
      this.dataService.generalAlert( { "message" : "Completa tu contraseña actual.", "status" : "error" } );
      return;
    }
    if( !this.currentUser$.nueva_contrasena ){
      this.dataService.generalAlert( { "message" : "Completa tu nueva contraseña.", "status" : "error" } );
      return;
    }
    if( !this.currentUser$.repetir_contrasena ){
      this.dataService.generalAlert( { "message" : "Repite tu nueva contraseña.", "status" : "error" } );
      return;
    }
    if( this.currentUser$.repetir_contrasena != this.currentUser$.nueva_contrasena ){
      this.dataService.generalAlert( { "message" : "Tu nueva contraseña no coincide con la repetición.", "status" : "error" } );
      return;
    }
    this.dataService.useService( "actualizar_usuario_contrasena" , { data : this.currentUser$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            if( data.status === "success" ){
              this.modalReference2.close();
              this.currentUser$.contrasena = this.currentUser$.nueva_contrasena;
              delete this.currentUser$.contrasena_actual;
              delete this.currentUser$.nueva_contrasena;
              delete this.currentUser$.repetir_contrasena;
              this.authenticationService.setUserNoRedirect(this.currentUser$);
            }
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  subirImagen( tipo$ ){
    this.modalReference = this.modalService.open(this.mImagen);
  }

  guardarPerfil(){
    if( !this.currentUser$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa tu nombre.", "status" : "error" } );
      return;
    }
    if( !this.currentUser$.correo ){
      this.dataService.generalAlert( { "message" : "Completa tu correo electrónico.", "status" : "error" } );
      return;
    }
    if( !this.currentUser$.telefono ){
      this.dataService.generalAlert( { "message" : "Completa tu teléfono.", "status" : "error" } );
      return;
    }
    this.dataService.useService( "actualizar_usuario_perfil" , { data : this.currentUser$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.authenticationService.setUserNoRedirect(this.currentUser$);
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  guardarImagen(){
    if( !this.croppedImage ){
      this.dataService.generalAlert( { "message" : "Sube una imagen.", "status" : "error" } );
      return;
    }
    this.currentUser$.foto = this.croppedImage;
    this.dataService.useService( "actualizar_foto_usuario" , { data : this.currentUser$ } )
    .subscribe
      (
          (data : any) =>   {
            this.currentUser$.foto = data.foto;
            this.modalReference.close();
            this.dataService.generalAlert(data);
            this.authenticationService.setUserNoRedirect(this.currentUser$);
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit(){
    this.currentUser$ = this.authenticationService.currentUserValue;
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

}
