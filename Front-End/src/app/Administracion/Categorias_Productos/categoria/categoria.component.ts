/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Categoria } from '../../../_models/categoria.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';

@Component({
  selector: 'categoria-producto-acceso',
  templateUrl: './categoria.component.html',
})

export class CategoriaProductosComponent implements OnInit {

  mainObj$ = new Categoria();
  mainObjParam$ = new Categoria();
  mainArray$: [];
  currentUser$ : any;
  modalReference: any;
  catalogo$: any;

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

  constructor( private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  borrar(){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_categoria_negocio" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/administracion/catalogos-categorias', { state: this.catalogo$ });
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
    // if( !this.mainObj$.foto ){
    //   this.dataService.generalAlert( { "message" : "Completa la imagen de la categoría.", "status" : "error" } );
    //   return;
    // }
    this.mainObj$.negocio_id = this.currentUser$.negocio_id;
    console.log(this.mainObj$);
    console.log(this.currentUser$);
    this.dataService.useService( "actualizar_categoria_catalogo" , { data : this.mainObj$, catalogo : this.catalogo$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/administracion/catalogos-categorias', { state: this.catalogo$ });
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

  irAArticulos(){
    this.router.navigateByUrl('/administracion/catalogos-productos', { state: this.mainObj$ });
  }

  ngOnInit() {
    console.log("Categoria individual");
    console.log(history.state);
    if( history.state.categoria ){
      if( history.state.categoria._id ){
        this.mainObj$ = history.state.categoria;
      }else{
        this.mainObj$ = new Categoria();
      }
    }else{
      this.mainObj$ = new Categoria();
    }
    if( history.state.catalogo ){
      if( history.state.catalogo._id ){
        this.catalogo$ = history.state.catalogo;
      }else{
        this.router.navigateByUrl('/administracion/catalogos', { });
      }
    }else{
      this.router.navigateByUrl('/administracion/catalogos', { });
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
  }

}
