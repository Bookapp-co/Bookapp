
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Ubicacion } from '../_models/ubicacion.model';
import { MapsAPILoader } from '@agm/core';
import { DataService } from '../data.service';
declare let google: any;

@Component({
  selector: 'seleccionar-direccion',
  templateUrl: './seleccionar-direccion.component.html',
})

export class SeleccionarDireccionComponent implements OnInit {

  @Input() locationParam           = new Ubicacion();
  @Input() currentLocation         : any;
  @Output() seleccionarDireccion   = new EventEmitter();
  @Output() cambiarDireccion       = new EventEmitter();
  @Output() eliminarDireccion      = new EventEmitter();

  public searchControl: FormControl;
  public zoom: number;

  ubicacionObj$ = new Ubicacion();
  geocoder : any;
  inputAddress: any;
  icon$ : any;
  currentLocation$ = false;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor( private dataService : DataService, private ngZone: NgZone, private mapsAPILoader: MapsAPILoader, private router: Router, private activatedRoute: ActivatedRoute ){
  }

  ubicacionChange() {
    if( !this.ubicacionObj$.latitude ){
      this.dataService.generalAlert({ "status" : "info" , "message" : "Completa una dirección." });
      return;
    }
    // if( !this.ubicacionObj$.referencia ){
    //   this.dataService.generalAlert({ "status" : "info" , "message" : "Completa la referencia de entrega." });
    //   return;
    // }
    this.seleccionarDireccion.emit(this.ubicacionObj$);
  }

  cambiarDireccionT() {
    this.cambiarDireccion.emit(this.ubicacionObj$);
  }

  eliminarDireccionT() {
    this.eliminarDireccion.emit(this.ubicacionObj$);
  }

  getDireccion(){
    let latlng = { lat: this.ubicacionObj$.latitude, lng: this.ubicacionObj$.longitude };
    this.geocoder.geocode({ 'location' : latlng }, (results, status) => this.ngZone.run(() => {
      if (results[0]) {
        this.ubicacionObj$.direccion = results[0].formatted_address;
      } else {
        this.dataService.generalAlert({ "status" : "info" , "message" : "No pudimos encontrar esta dirección." });
      }
    }));
  }

  mapClicked( $event: any ) {
    this.ubicacionObj$.latitude = $event.coords.lat;
    this.ubicacionObj$.longitude = $event.coords.lng;
    this.getDireccion();
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
    // console.log('dragEnd', m, $event);
  }

  ngOnInit() {
    this.icon$ = {
      url : "https://codigeek.com/projects/bookapp/icon_ubication_.png",
      scaledSize: {
        width: 50,
        height: 50
      }
    }
    console.log(this.locationParam);
    this.ubicacionObj$ = this.locationParam;
    this.currentLocation$ = this.currentLocation;
    if( this.currentLocation$ ){
      this.setCurrentPosition();
    }
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  setCurrentPosition() {
    if ("geolocation" in navigator) {
      console.log("currentposition");
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("currentposition2");
        this.ubicacionObj$.latitude  = position.coords.latitude;
        this.ubicacionObj$.longitude = position.coords.longitude;
        this.getDireccion();
      }, function(error) {
      });
    }else{
      this.dataService.generalAlert({ "status" : "info" , "message" : "Activa tu geoubicación para poder ubicarte automáticamente" });
    }
  }

  private getPlaceAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      this.zoom = 16;
      this.geocoder = new google.maps.Geocoder;
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
          {
              types: ['geocode','establishment']
          }
      );
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
          this.ngZone.run(() => {
            const place = autocomplete.getPlace();
            this.ubicacionObj$.direccion  = place.formatted_address;
            this.ubicacionObj$.latitude   = place.geometry.location.lat();
            this.ubicacionObj$.longitude  = place.geometry.location.lng();
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
