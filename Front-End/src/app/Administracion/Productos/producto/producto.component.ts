/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Platillo } from '../../../_models/platillo.model';
import { Grupo_Ingrediente } from '../../../_models/grupo_ingrediente.model';
import { Ingrediente } from '../../../_models/ingrediente.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';

@Component({
  selector: 'producto-acceso',
  templateUrl: './producto.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductoComponent implements OnInit {

  mainObj$ = new Platillo();
  mainObjParam$ = new Platillo();
  grupoObj$ = new Grupo_Ingrediente();
  ingredienteObj$ = new Ingrediente();
  mainArray$: [];
  categoriasArray$: [];
  currentUser$ : any;
  categoria$ : any;
  modalReference: any;
  modalReference2: any;

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
  @ViewChild('listadoCategorias') listadoCategorias: TemplateRef<any>;
  @ViewChild('mGrupo') mGrupo: TemplateRef<any>;
  @ViewChild('mIngrediente') mIngrediente: TemplateRef<any>;

  constructor( private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  agregarGrupo( grupo_t ){
    if( !grupo_t ){
      this.grupoObj$ = new Grupo_Ingrediente();
      this.grupoObj$.nuevo = true;
    }else{
      this.grupoObj$ = grupo_t;
      this.grupoObj$.nuevo = false;
    }
    this.modalReference2 = this.modalService.open(this.mGrupo);
  }

  returnGrupo(){
    if( !this.ingredienteObj$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre de la opción.", "status" : "error" } );
      return;
    }
    if( this.grupoObj$.nuevo ){
      this.mainObj$.grupo_ingrediente.push(this.grupoObj$);
    }else{

    }
    this.modalReference2.close();
  }

  borrarGrupo( grupo_t ){
    for( var i = 0; i<this.mainObj$.grupo_ingrediente.length; i++ ){
      if( grupo_t.id === this.mainObj$.grupo_ingrediente[i].id ){
        this.mainObj$.grupo_ingrediente.splice( i,1 );
      }
    }
  }

  agregarIngrediente( ingrediente_t ){
    if( !ingrediente_t ){
      this.ingredienteObj$ = new Ingrediente();
      this.ingredienteObj$.nuevo = true;
    }else{
      this.ingredienteObj$ = ingrediente_t;
      this.ingredienteObj$.nuevo = false;
    }
    this.modalReference = this.modalService.open(this.mIngrediente);
  }

  returnIngrediente(){
    if( !this.ingredienteObj$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre de la opción.", "status" : "error" } );
      return;
    }
    if( this.ingredienteObj$.nuevo ){
      this.grupoObj$.ingredientes.push(this.ingredienteObj$);
    }else{

    }
    this.modalReference.close();
  }

  borrarIngrediente( ingrediente_t ){
    for( var i = 0; i<this.grupoObj$.ingredientes.length; i++ ){
      if( ingrediente_t.id === this.grupoObj$.ingredientes[i].id ){
        this.grupoObj$.ingredientes.splice( i,1 );
      }
    }
  }

  seleccionarCategoria(){
    this.dataService.useService( "get_categorias_catalogo" , { data : this.categoria$ } )
    .subscribe
      (
          (data : any) =>   {
            this.categoriasArray$ = data.data;
            this.modalReference = this.modalService.open(this.listadoCategorias);
            this.modalReference.result.then((result) => {
              this.mainObj$.categoria = result;
              this.mainObj$.categoria_id = result._id;
            }, (reason) => {
            });
          },
          error =>  {
          }
    );
  }

  borrar(){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_platillo_catalogo" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/administracion/catalogos-productos', { state: this.categoria$ });
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }, (reason) => {
    });
  }

  guardar(){
    if( !this.mainObj$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre del artículo.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.descripcion ){
      this.dataService.generalAlert( { "message" : "Completa la descripción del artículo.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.costo ){
      this.dataService.generalAlert( { "message" : "Completa el costo del artículo.", "status" : "error" } );
      return;
    }
    // if( !this.mainObj$.foto ){
    //   this.dataService.generalAlert( { "message" : "Completa la imagen del platillo.", "status" : "error" } );
    //   return;
    // }
    // if( !this.mainObj$.categoria_id ){
    //   this.dataService.generalAlert( { "message" : "Completa la categoría del artículo.", "status" : "error" } );
    //   return;
    // }
    this.mainObj$.categoria_id = this.categoria$._id;
    this.mainObj$.negocio_id = this.currentUser$.negocio_id;
    this.mainObj$.fecha_alta = new Date();
    this.dataService.useService( "actualizar_platillo_catalogo" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/administracion/catalogos-productos', { state: this.categoria$ });
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
    }, (reason) => {
    });
  }

  // MODALS - IMAGES

  //Cropper
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady() {
  }

  loadImageFailed() {
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

  getPlatilloById(){
    this.dataService.useService( "get_platillo_catalogo_by_id" , { data : this.mainObj$ } )
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

  ngOnInit() {
    if( history.state._id ){
      this.mainObj$ = history.state;
      this.getPlatilloById();
    }
    if( history.state.producto ){
      if( history.state.producto._id ){
        this.mainObj$ = history.state.producto;
      }else{
        this.mainObj$ = new Platillo();
      }
    }else{
      this.mainObj$ = new Platillo();
    }
    if( history.state.categoria ){
      if( history.state.categoria._id ){
        this.categoria$ = history.state.categoria;
      }else{
        this.router.navigateByUrl('/administracion/catalogos', { });
      }
    }else{
      this.router.navigateByUrl('/administracion/catalogos', { });
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
  }

}
