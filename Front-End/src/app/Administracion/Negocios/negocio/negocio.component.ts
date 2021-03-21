/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Negocio } from '../../../_models/negocio.model';
import { Imagen } from '../../../_models/imagen.model';
import { Configuracion } from '../../../_models/configuracion.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import { MapsAPILoader } from '@agm/core';
declare let google: any;

@Component({
  selector: 'negocio-acceso',
  templateUrl: './negocio.component.html',
})

export class NegocioComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  configuracion$ = new Configuracion();

  mainObj$ = new Negocio();
  mainObjParam$ = new Negocio();
  galeria$ = new Imagen();
  mainArray$: [];
  categoriasArray$: [];
  usuariosArray$: [];
  currentUser$ : any;
  geocoder : any;
  tipoImagen$: 1; // 1 -- Banner , 2 -- Logo
  modalReference: any;
  isAdmin: any;

  public imagePath;
  imgURL: any;
  public isActive: any;

  archivo1$: any;
  archivo2$: any;
  archivo3$: any;

  // Cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  @ViewChild('mImagen') templateSubirImagen: TemplateRef<any>;
  @ViewChild('listadoUsuarios') listadoUsuarios: TemplateRef<any>;
  @ViewChild('listadoCategorias') listadoCategorias: TemplateRef<any>;
  @ViewChild('mBorrar') mBorrar: TemplateRef<any>;
  @ViewChild('mImagenNegocio') mImagenNegocio: TemplateRef<any>;

  constructor( private ngZone: NgZone, private mapsAPILoader: MapsAPILoader, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  agregarGaleria(){
    this.modalReference = this.modalService.open(this.mImagenNegocio);
  }

  guardarGaleria(){
    this.galeria$.foto = this.croppedImage;
    this.dataService.useService( "guardar_galeria_negocio" , { data : this.mainObj$, imagen : this.galeria$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.galeria$ = new Imagen();
            this.modalReference.close();
            this.getNegocioById();
          },
          error =>  {
          }
    );
  }

  borrarGaleria(galeria_t){
    this.dataService.useService( "borrar_galeria_negocio" , { data : galeria_t } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.getNegocioById();
          },
          error =>  {
          }
    );
  }

  editarRegistro( registroEditar ){
    this.dataService.useService( "get_negocio_by_id" , { data : registroEditar } )
    .subscribe
      (
          (data : any) =>   {
            this.router.navigateByUrl('/administracion/sucursal', { state: data.data[0] });
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  // heading = 'Negocio';
  // subheading = 'Administración del negocio';
  // icon = 'pe-7s-users icon-gradient bg-tempting-azure';

  // getAddress(){
  //   let latlng = { lat: this.mainObj$.latitude, lng: this.mainObj$.longitude };
  //   this.geocoder.geocode({'location': latlng}, function(results) {
  //       if (results[0]) {
  //         this.mainObj$.direccion = results[0].formatted_address;
  //       } else {
  //         console.log('Sin resultados');
  //       }
  //   });
  // }

  abrirArchivo(url_t){
    window.open(url_t, "_system");
  }

  borrar(){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_negocio" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/administracion/negocios', { });
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }, (reason) => {
      console.log("exit");
    });
  }

  verificarGuardado(){
    if(this.isAdmin){
      this.guardarAdmin();
    }else{
      this.guardarNegocio();
    }
  }

  guardarAdmin(){
    if( !this.mainObj$.nombre ){
      this.dataService.generalAlert( { "message" : "Captura el nombre.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.descripcion ){
      this.dataService.generalAlert( { "message" : "Captura la descripción.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.telefono ){
      this.dataService.generalAlert( { "message" : "Captura el teléfono.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.comision ){
      // this.dataService.generalAlert( { "message" : "Captura la comisión.", "status" : "error" } );
      // return;
      this.mainObj$.comision = 0;
    }
    if( !this.mainObj$.latitude ){
      this.dataService.generalAlert( { "message" : "Captura la ubicación del negocio.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.categoria ){
      this.dataService.generalAlert( { "message" : "Captura la categoría del negocio.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.usuario ){
      this.dataService.generalAlert( { "message" : "Captura el administrador del negocio.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.numero_cuenta ){
      this.dataService.generalAlert( { "message" : "Captura el número de cuenta.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.banco ){
      this.dataService.generalAlert( { "message" : "Captura el banco.", "status" : "error" } );
      return;
    }
    if(this.mainObj$.id_foto_anverso){
      this.mainObj$.id_foto_anverso_url = "https://codigeek.app/bookapp/uploads/" + this.archivo1$.name;
      this.dataService.guardarArchivo( this.mainObj$.id_foto_anverso );
    }
    if(this.mainObj$.id_foto_inverso){
      this.mainObj$.id_foto_inverso_url = "https://codigeek.app/bookapp/uploads/" + this.archivo2$.name;
      this.dataService.guardarArchivo( this.mainObj$.id_foto_inverso );
    }
    if(this.mainObj$.id_foto_ruc){
      this.mainObj$.id_foto_ruc_url = "https://codigeek.app/bookapp/uploads/" + this.archivo3$.name;
      this.dataService.guardarArchivo( this.mainObj$.id_foto_ruc );
    }

    this.dataService.useService( "actualizar_negocio" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/administracion/negocios', { });
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  guardarNegocio(){
    if( !this.mainObj$.nombre ){
      this.dataService.generalAlert( { "message" : "Captura el nombre.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.descripcion ){
      this.dataService.generalAlert( { "message" : "Captura la descripción.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.telefono ){
      this.dataService.generalAlert( { "message" : "Captura el teléfono.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.latitude ){
      this.dataService.generalAlert( { "message" : "Captura la ubicación del negocio.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.numero_cuenta ){
      this.dataService.generalAlert( { "message" : "Captura el número de cuenta.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.banco ){
      this.dataService.generalAlert( { "message" : "Captura el banco.", "status" : "error" } );
      return;
    }
    if(this.mainObj$.id_foto_anverso){
      this.mainObj$.id_foto_anverso_url = "https://codigeek.app/bookapp/uploads/" + this.archivo1$.name;
      this.dataService.guardarArchivo( this.mainObj$.id_foto_anverso );
    }
    if(this.mainObj$.id_foto_inverso){
      this.mainObj$.id_foto_inverso_url = "https://codigeek.app/bookapp/uploads/" + this.archivo2$.name;
      this.dataService.guardarArchivo( this.mainObj$.id_foto_inverso );
    }
    if(this.mainObj$.id_foto_ruc){
      this.mainObj$.id_foto_ruc_url = "https://codigeek.app/bookapp/uploads/" + this.archivo3$.name;
      this.dataService.guardarArchivo( this.mainObj$.id_foto_ruc );
    }
    this.dataService.useService( "actualizar_negocio" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.currentUser$.negocio = this.mainObj$;
            this.authenticationService.setUser(this.currentUser$);
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked( $event: any ) {
    console.log("clickmap");
    console.log($event);
    this.mainObj$.latitude  = $event.coords.lat;
    this.mainObj$.longitude = $event.coords.lng;
    // this.getAddress();
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  // setCurrentPosition() {
  //   console.log("current_position");
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       console.log(position);
  //       this.mainObj$.latitude  = position.coords.latitude;
  //       this.mainObj$.longitude = position.coords.longitude;
  //       this.getAddress();
  //     });
  //   }
  // }


  // MODALS - IMAGES

  getNegocioById(){
    this.dataService.useService( "get_negocio_by_id" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.mainObj$.galeria = data.data[0].galeria;
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
    if(this.tipoImagen$ === 1){
      this.mainObj$.banner_image = this.croppedImage;
      this.dataService.useService( "actualizar_banner" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.modalReference.close();
              this.dataService.generalAlert(data);
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }else{
      this.mainObj$.foto = this.croppedImage;
      this.dataService.useService( "actualizar_logo" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.modalReference.close();
              this.dataService.generalAlert(data);
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }
  }

  subirImagen( tipo$ ){
    this.tipoImagen$ = tipo$;
    this.open(this.templateSubirImagen);
  }

  preview(files){

    if (files.length === 0){
      return;
    }

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.dataService.generalAlert( { "message" : "Selecciona una imagen válida.", "status" : "error" } );
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      console.log("image_loaded_file");
      console.log(this.imgURL);
      this.imageLoaded();
    }

  }

  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("modal_closed");
    }, (reason) => {
      console.log("exit");
    });
  }

  seleccionarCategoria(){
    console.log("seleccionarCategoria");
    this.dataService.useService( "get_categorias" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.categoriasArray$ = data.data;
            console.log(this.categoriasArray$);
            this.modalReference = this.modalService.open(this.listadoCategorias);
            this.modalReference.result.then((result) => {
              this.mainObj$.categoria = result;
              this.mainObj$.categoria_id = result._id;
            }, (reason) => {
              console.log("exit");
            });
          },
          error =>  {
            alert("Error");
          }
    );
  }

  seleccionarAdministrador(){
    console.log("seleccionarAdministrador");
    this.dataService.useService( "get_usuarios" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.usuariosArray$ = data.data;
            console.log(this.usuariosArray$);
            this.modalReference = this.modalService.open(this.listadoUsuarios);
            this.modalReference.result.then((result) => {
              this.mainObj$.usuario = result;
              this.mainObj$.usuario_id = result._id;
            }, (reason) => {
              console.log("exit");
            });
          },
          error =>  {
            alert("Error");
          }
    );
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
  }

  rotateRight() {
  }

  flipHorizontal() {
  }

  flipVertical() {
  }

  fotoFrontalChangeEvent(event: any): void {
     this.mainObj$.id_foto_anverso = event.target.files[0];
     this.archivo1$ = event.target.files[0];
  }

  fotoInversaChangeEvent(event: any): void {
     this.mainObj$.id_foto_inverso = event.target.files[0];
     this.archivo2$ = event.target.files[0];
  }

  fotoRUCChangeEvent(event: any): void {
     this.mainObj$.id_foto_ruc = event.target.files[0];
     this.archivo3$ = event.target.files[0];
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

    this.currentUser$ = this.authenticationService.currentUserValue;

    this.isAdmin = false;

    switch( this.currentUser$.tipo_usuario_id ){
      //Admin App
      case "5c4050f358209844a83c8622":
        this.isAdmin = true;
      break;
    }

    console.log("Param on init negocio");
    console.log(history.state);
    this.mainObj$ = history.state;
    if( !this.mainObj$._id ){
      this.router.navigateByUrl('/administracion/negocios', { });
      return;
    }
    if( !this.mainObj$.banner_image ){
      this.mainObj$.banner_image = "https://www.codigeek.com/projects/bookapp/background_negocio.png";
    }
    this.getConfiguracion();

    // this.setCurrentPosition();

    // google maps zoom level
    this.zoom = 13;
    this.mapsAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
          {
              types: ['geocode','establishment']
          }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          console.log("autocomplete data");
          console.log(place);
          this.mainObj$.direccion = place.formatted_address;
          this.mainObj$.latitude = place.geometry.location.lat();
          this.mainObj$.longitude = place.geometry.location.lng();
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          console.log(this.mainObj$);


        });
      });
    });

  }

}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
