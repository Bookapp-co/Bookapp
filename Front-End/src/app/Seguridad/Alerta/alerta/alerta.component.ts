/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Alerta } from '../../../_models/alerta.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import { MapsAPILoader } from '@agm/core';
declare let google: any;

@Component({
  selector: 'alerta-acceso',
  templateUrl: './alerta.component.html',
})

export class AlertaComponent implements OnInit {

  mainObj$ = new Alerta();
  mainObjParam$ = new Alerta();
  mainArray$: [];
  tiposArray$: [];
  usuariosArray$: [];
  currentUser$ : any;
  modalReference: any;
  zoom: any;
  validaciones$: any;
  geocoder : any;

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

  @ViewChild('mListadoUsuarios') mListadoUsuarios: TemplateRef<any>;
  @ViewChild('mConfirmacion') mConfirmacion: TemplateRef<any>;

  constructor( private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  enviarNotificacion(){
    if(!this.mainObj$.titulo){
      this.dataService.generalAlert( { "message" : "Captura el título", "status" : "info" } );
      return;
    }
    if(!this.mainObj$.mensaje){
      this.dataService.generalAlert( { "message" : "Captura el mensaje", "status" : "info" } );
      return;
    }
    this.mainObj$.fecha_alta = new Date();
    this.dataService.useService( "enviar_alertas" , { data : this.mainObj$, usuario : this.currentUser$, usuarios : this.usuariosArray$ } )
    .subscribe
      (
          (data : any) =>   {
            this.modalReference.close();
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/seguridad/alertas', { });
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  guardar(){
    if(!this.mainObj$.titulo){
      this.dataService.generalAlert( { "message" : "Captura el título", "status" : "info" } );
      return;
    }
    if(!this.mainObj$.mensaje){
      this.dataService.generalAlert( { "message" : "Captura el mensaje", "status" : "info" } );
      return;
    }
    if(
      this.mainObj$.administradores || this.mainObj$.clientes || this.mainObj$.sucursales
    ){
      if( this.mainObj$.ubicacion_toggle === 1 ){
        if(!this.mainObj$.latitude){
          this.dataService.generalAlert( { "message" : "Captura la ubicación", "status" : "info" } );
          return;
        }
        this.dataService.useService( "enviar_alertas_con_ubicacion" , { data : this.mainObj$, usuario : this.currentUser$ } )
        .subscribe
          (
              (data : any) =>   {
                this.usuariosArray$ = data.data;
                this.modalReference = this.modalService.open(this.mConfirmacion);
              },
              error =>  {
                this.dataService.generalAlert(error);
              }
        );
      }else{
        this.dataService.useService( "enviar_alertas_sin_ubicacion" , { data : this.mainObj$, usuario : this.currentUser$ } )
        .subscribe
          (
              (data : any) =>   {
                this.usuariosArray$ = data.data;
                this.modalReference = this.modalService.open(this.mConfirmacion);
              },
              error =>  {
                this.dataService.generalAlert(error);
              }
        );
      }
    }else{
      this.dataService.generalAlert( { "message" : "Error al enviar alerta", "status" : "info" } );
      return;
    }
  }

  ngOnInit() {

    if( history.state._id ){
      this.mainObj$ = history.state;
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
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
          this.mainObj$.direccion = place.formatted_address;
          this.mainObj$.latitude = place.geometry.location.lat();
          this.mainObj$.longitude = place.geometry.location.lng();
          console.log(this.mainObj$);
        });
      });
    });
  }

}
