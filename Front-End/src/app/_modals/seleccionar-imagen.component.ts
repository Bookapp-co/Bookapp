
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Imagen } from '../_models/imagen.model';
import { DataService } from '../data.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'seleccionar-imagen',
  templateUrl: './seleccionar-imagen.component.html',
})

export class SeleccionarImagenComponent implements OnInit {

  @Output() seleccionarImagen   = new EventEmitter();

  public imagePath;
  imgURL: any;
  public isActive: any;

  // Cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;


  imagennObj$ = new Imagen();

  constructor( private dataService : DataService, private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute ){
  }

  guardarImagen() {
    if( !this.imagennObj$.foto ){
      this.dataService.generalAlert({ "status" : "info" , "message" : "Completa la imagen." });
      return;
    }
    this.seleccionarImagen.emit(this.imagennObj$);
  }

  //Cropper
  fileChangeEvent(event: any): void {
    console.log("file changed");
    console.log("event");
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imagennObj$.foto = event.base64;
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
  }


}
