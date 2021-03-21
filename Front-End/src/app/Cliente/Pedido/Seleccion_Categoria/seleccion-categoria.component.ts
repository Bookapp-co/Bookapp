import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Servicio } from '../../../_models/servicio.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import {animate, query, style, transition, trigger} from '@angular/animations';
import { Configuracion } from '../../../_models/configuracion.model';

@Component({
  selector: 'cliente-seleccion-categoria',
  templateUrl: './seleccion-categoria.component.html',
  animations: [

    trigger('categorias', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ])
  ]
})
export class SeleccionCategoriaComponent implements OnInit {

  mainObject$ = new Servicio();
  configuracion$    = new Configuracion();
  mainArray$ = [];
  negociosCercanos$ = [];
  publicidadesArray$ = [];
  promocionesArray$ = [];
  pedidosArray$: [];
  currentUser$ : any;
  isActive = true;
  searchText = "";
  ubicacion$ : any;

  heading = '¿Qué se te antoja hoy?';
  subheading = 'Encuentra restaurantes cerca de tí';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  bannersSlidesConfig = {
    autoplay: true,
    className: 'center',
    centerMode: false,
    infinite: true,
    centerPadding: '10px',
    slidesToShow: 3,
    swipeToSlide: true,
    speed: 300,
    dots: true,
    arrows: false
  };

  bannersSlidesConfigMobile = {
    autoplay: true,
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '10px',
    slidesToShow: 1,
    swipeToSlide: true,
    speed: 300,
    dots: true,
    arrows: false
  };

  constructor( private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal, private authenticationService: AuthenticationService ){ }
  
  irAUbicaciones(){
	this.router.navigate(['pages/ubicaciones'], {  });
  }

  seleccionarPromocion(registro_t){
    this.dataService.useService( "get_negocio_by_id" , { data : registro_t.negocio } )
    .subscribe
      (
          (data : any) =>   {
            this.router.navigateByUrl('/pedidos/checkout', { state: { negocio : data.data[0], servicio : registro_t } });
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  seleccionarPublicidad(registro_t){
    this.dataService.useService( "get_negocio_by_id" , { data : registro_t.negocio } )
    .subscribe
      (
          (data : any) =>   {
            this.router.navigateByUrl('/pedidos/checkout', { state: { negocio : data.data[0] } });
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

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

  seleccionarPideLoQueQuieras(){
    this.router.navigateByUrl('/cliente/pideloquequieras', {  });
  }

  irATerminos(){
    this.router.navigateByUrl('/pages/terminos', { });
  }

  irAReferidos(){
    this.router.navigateByUrl('/pages/referido', { });
  }

  getNegociosCercanos(){
    this.dataService.useService( "get_negocios_cerca_de_mi" , { usuario : this.currentUser$, ubicacion : this.ubicacion$ } )
    .subscribe
      (
          (data : any) =>   {
            this.negociosCercanos$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  seleccionarCategoria(registro_t){

    if( !registro_t ){
      registro_t = {
        foto: "https://codigeek.app/bookapp/bookapp_fotos/5dc4a9db2a116014de99b226_categoria_foto.png?83ExW",
        negocio_id: "",
        nombre: "Cerca de mí",
        status: 1,
        _id: "cercademi"
      }
    }
	
	if(this.currentUser$){
		 if( !this.currentUser$.direccion ){
		  this.dataService.generalAlert({ "status" : "info" , "message" : "Completa tu dirección para encontrar restaurantes cerca de tí." });
		  return;
		}
		if( !this.currentUser$.longitude ){
		  this.dataService.generalAlert({ "status" : "info" , "message" : "Completa tu dirección para encontrar restaurantes cerca de tí." });
		  return;
		}
	}
   

    this.router.navigateByUrl('/cliente/seleccion-negocio', { state: { categoria : registro_t, ubicacion : this.ubicacion$ } });
  }

  getRegistros(){
    this.dataService.useService( "get_categorias" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.mainArray$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getPublicidades(){
    this.dataService.useService( "get_publicidades_admin" , { } )
    .subscribe
      (
          (data : any) =>   {
            this.publicidadesArray$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getPromociones(){
    this.dataService.useService( "get_categorias_negocio_promociones" , { } )
    .subscribe
      (
          (data : any) =>   {
            this.promocionesArray$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
	this.ubicacion$   = history.state.ubicacion;
    if(this.currentUser$){
      if(!this.currentUser$.latitude){
        this.router.navigate(['pages/ubicaciones'], {  });
        return;
      }
    }else{
		if( history.state.ubicacion ){
		  this.ubicacion$ = history.state.ubicacion;
		  localStorage.setItem('ubicacionTemporal', JSON.stringify(this.ubicacion$));
		}
		
		if( !this.currentUser$ ){
			if( !this.ubicacion$ ){		
				if(localStorage.getItem('ubicacionTemporal')){
					this.ubicacion$ = JSON.parse(localStorage.getItem('ubicacionTemporal'));
				}else{
					this.router.navigate(['pages/ubicaciones'], {  });
					return;
				}
			}
		}
	}
    this.getRegistros();
    this.getNegociosCercanos();
    this.getConfiguracion();
    this.getPublicidades();
    this.getPromociones();
  }

}
