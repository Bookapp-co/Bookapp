import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import {animate, query, style, transition, trigger} from '@angular/animations';
import { Negocio } from '../../_models/negocio.model';
import { Pedido } from '../../_models/pedido.model';
import { Ubicacion } from '../../_models/ubicacion.model';
import { MapsAPILoader } from '@agm/core';

declare let google: any;

@Component({
  selector: 'cliente-notificaciones',
  templateUrl: './notificaciones.component.html',
  animations: [

    trigger('restaurantes', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ])
  ]
})
export class NotificacionesComponent implements OnInit {

  heading = 'Notificaciones';
  subheading = 'Tus alertas y notificaciones';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  notificacionesArray$ : [];
  currentUser$ : any;

  constructor( private sanitizer: DomSanitizer, private ngZone: NgZone, private mapsAPILoader: MapsAPILoader, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){ }

  regresar(){
    this.router.navigateByUrl('/pedidos/admin', { });
  }

  getNotificaciones(){
    this.dataService.useService( "get_notificaciones" , { data : this.currentUser$ } )
    .subscribe
      (
          (data : any) =>   {
            this.notificacionesArray$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  switchFoto( articulo_t , tipo_t ){
    console.log("switchFoto");
    var test_position = 0;
    if( tipo_t === -1 ){
      console.log(1);
      test_position = articulo_t.current_foto - 1;
      if( articulo_t.imagenes[test_position] ){
        articulo_t.current_foto = test_position;
      }else{
        articulo_t.current_foto = articulo_t.imagenes.length-1;
      }
    }else{
      console.log(2);
      test_position = articulo_t.current_foto + 1;
      if( articulo_t.imagenes[test_position] ){
        articulo_t.current_foto = test_position;
      }else{
        articulo_t.current_foto = 0;
      }
    }
    console.log(articulo_t.current_foto);
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getNotificaciones();
  }

}
