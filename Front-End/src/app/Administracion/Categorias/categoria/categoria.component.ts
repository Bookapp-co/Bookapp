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
  selector: 'categoria-acceso',
  templateUrl: './categoria.component.html',
})

export class CategoriaComponent implements OnInit {

  mainObj$ = new Categoria();
  mainObjParam$ = new Categoria();
  mainArray$: [];
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

  constructor( private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  borrar(){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_categoria" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/administracion/categorias', { });
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
    this.dataService.useService( "actualizar_categoria" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/administracion/categorias', { });
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
    console.log("Param on init categoria");
    console.log(history.state);
    if( history.state._id ){
      this.mainObj$ = history.state;
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
  }

}
