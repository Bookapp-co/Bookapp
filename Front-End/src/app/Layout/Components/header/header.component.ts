import {Input, Directive, Component, HostBinding, ViewContainerRef, TemplateRef, ViewChild} from '@angular/core';
// import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {Usuario} from '../../../_models/usuario.model';
import {Ubicacion} from '../../../_models/ubicacion.model';
import {ThemeOptions} from '../../../theme-options';
import { DataService } from '../../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot, RouterOutlet, NavigationEnd } from '@angular/router';
import {animate, query, style, transition, trigger, animateChild, group} from '@angular/animations';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

// animations: [
//   trigger('fade', [
//     transition('void => *', [
//       style(
//         {
//           opacity: 0,
//           color: '#0098f0',
//           'margin-left': '20px'
//         }
//       ),
//       animate(
//         '500ms ease-out',
//         style(
//           {
//             opacity: 1,
//             color: 'black',
//             'margin-left': '0px'
//           }
//         )
//       )
//     ])
//   ])
// ]


export class HeaderComponent {

  headerTitle: string;
  currentValue: any;
  hasView = false;
  currentUrl$ : any;
  currentUser$ : any;
  zoom: any;
  mapStyles: any;
  geocoder : any;
  icon$ : any;
  modalReference : any;
  modalMaxHeight$:any;
  ubicacion$ = new Ubicacion();

  @ViewChild('mDireccion') mDireccion: TemplateRef<any>;

  constructor(
    public globals: ThemeOptions,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private mapsAPILoader: MapsAPILoader,
    private dataService : DataService
  ) {
    router.events.subscribe((val) => {
      if( val instanceof NavigationEnd ){
        this.currentUrl$ = val.url;
        console.log(this.currentUrl$);
      }
    });
    authenticationService.getHeaderTitle.subscribe(name => this.changeTitle(name));
  }

  @HostBinding('class.isActive')
  get isActiveAsGetter() {
    return this.isActive;
  }

  isActive: boolean;

  // @select('config') public config$: Observable<any>;

  abrirUbicacion(){
    this.router.navigate(['pages/ubicaciones'], {  });
    // this.modalReference = this.modalService.open(this.mDireccion);
  }

  irANotificaciones(){
    this.router.navigate(['general/notificaciones'], {  });
  }

  irAPerfil(){
    if( this.currentUrl$ === '/usuario/menu' ){
      var usuario_t = this.currentUser$;
      switch( usuario_t.tipo_usuario_id ){
        //Admin App
        case "5c4050f358209844a83c8622":
          this.router.navigate(['administracion/dashboard'], {  });
        break;
        //Admin Neg
        case "5c4050fa58209844a83c8623":
          this.router.navigate(['negocio/dashboard'], {  });
        break;
        case "5e30cadaec6ea3c622235f99":
        case "5e30cadfec6ea3c622235f9a":
        case "5e30cae5ec6ea3c622235f9b":
          this.router.navigate(['pedidos/listado'], {  });
        break;
        //Repartidor
        case "5c40513658209844a83c862a":
          this.router.navigate(['pedidos/listado'], {  });
        break;
        //Cliente
        case "5c40513258209844a83c8629":
          this.router.navigate(['cliente/seleccion-categoria'], {  });
        break;
      }
    }else{
      this.router.navigateByUrl('/usuario/menu', { });
    }
  }

  cambiarUbicacion( $event ){

    $event.srcElement.blur();
    $event.preventDefault();

    console.log($event);

    // if( this.mainObject$.destino_direccion ){
    //   this.ubicacionObj$.direccion    = this.mainObject$.destino_direccion;
    // }
    // if( this.mainObject$.destino_latitude ){
    //   this.ubicacionObj$.latitude     = this.mainObject$.destino_latitude;
    // }
    // if( this.mainObject$.destino_longitude ){
    //   this.ubicacionObj$.longitude    = this.mainObject$.destino_longitude;
    // }

  }

  private changeTitle(name: string): void {
    name = name.replace("-", " ");
    name = name.replace("-", " ");
    this.headerTitle = name;
  }

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
  }

  toggleHeaderMobile() {
    this.globals.toggleHeaderMobile = !this.globals.toggleHeaderMobile;
  }

  seleccionarDireccion(nuevasCoordenadasT){
    this.ubicacion$.direccion      = nuevasCoordenadasT.direccion;
    this.ubicacion$.latitude       = nuevasCoordenadasT.latitude;
    this.ubicacion$.longitude      = nuevasCoordenadasT.longitude;
    this.currentUser$.direccion    = nuevasCoordenadasT.direccion;
    this.currentUser$.latitude     = nuevasCoordenadasT.latitude;
    this.currentUser$.longitude    = nuevasCoordenadasT.longitude;
    this.dataService.useService( "actualizar_ubicacion_usuario" , { usuario : this.currentUser$ } )
    .subscribe
      (
          (data : any) =>   {
            this.authenticationService.changeUserInfo(this.currentUser$);
          },
          error =>  {
          }
    );
    this.modalReference.close();
  }

  setCurrentPosition() {
    console.log("current_position");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.ubicacion$.latitude  = position.coords.latitude;
        this.ubicacion$.longitude = position.coords.longitude;
      });
    }
  }

  ngOnInit(){
    this.modalMaxHeight$ = window.innerHeight*.70+"px";
    this.currentUser$ = this.authenticationService.currentUserValue;
    if(this.currentUser$){
      this.ubicacion$.direccion      = this.currentUser$.direccion;
      this.ubicacion$.latitude       = this.currentUser$.latitude;
      this.ubicacion$.longitude      = this.currentUser$.longitude;
    }
  }

}
