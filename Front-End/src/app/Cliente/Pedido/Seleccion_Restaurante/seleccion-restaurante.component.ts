import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Servicio } from '../../../_models/servicio.model';
import { Filtro_Negocio } from '../../../_models/filtro_negocio.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import {animate, query, style, transition, trigger} from '@angular/animations';
import { Categoria } from '../../../_models/categoria.model';

@Component({
  selector: 'cliente-seleccion-restaurante',
  templateUrl: './seleccion-restaurante.component.html',
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
export class SeleccionRestauranteComponent implements OnInit {

  categoriaObj$ = new Categoria();
  mainObject$ = new Servicio();
  filtroNegocio$ = new Filtro_Negocio();
  mainArray$ = [];
  pedidosArray$: [];
  currentUser$ : any;
  especialidades$ : any;
  modalReference2 : any;
  searchText = "";
  isActive = true;
  noRecords$ = false;
  ubicacion$ : any;

  heading = 'Los mejores restaurantes';
  subheading = 'Encuentra lo que buscas cerca de tí';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('mEspecialidades') mEspecialidades: TemplateRef<any>;

  constructor(
    private router                : Router,
    private sanitizer             : DomSanitizer,
    private dataService           : DataService,
    private modalService          : NgbModal,
    private authenticationService : AuthenticationService
    ){
      authenticationService.getUbicacion.subscribe(data => this.getRegistros(data));
  }

  seleccionarEspecialidadFiltro(){
    this.dataService.useService( "get_especialidades" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.especialidades$ = data.data;
            this.modalReference2 = this.modalService.open(this.mEspecialidades);
            this.modalReference2.result.then((result) => {
              if( result === "todos" ){
                this.filtroNegocio$.categoria = result;
                this.filtroNegocio$.categoria_id = result._id;
                this.getRegistros(null);
              }else{
                this.filtroNegocio$.categoria    = result;
                this.filtroNegocio$.categoria_id = result._id;
                this.getRegistrosByEspecialidad();
              }
            }, (reason) => {
              console.log("exit");
            });
          },
          error =>  {
            alert("Error");
          }
    );
  }

  seleccionarRestaurante(registro_t){
	if(this.currentUser$){
		this.router.navigateByUrl('/pedidos/checkout', { state: { negocio : registro_t } });
	}else{
		this.dataService.generalAlert({ status : "success" , message : "Estás a un paso de registrar tu cita, registra tu información para continuar" });
		this.router.navigateByUrl('/pages/registro', { state: { ubicacion : this.ubicacion$, regresar_a_checkout : true, negocio : registro_t } });
	}    
  }

  regresar(){
    this.router.navigateByUrl('/cliente/seleccion-categoria', {  });
  }

  abrirUbicacion(){
    this.router.navigate(['pages/ubicaciones'], { state : { regresar : '/cliente/seleccion-negocio' } });
  }

  getRegistrosByEspecialidad(){
    this.dataService.useService( "get_negocios_by_categoria_especialidad" , { data : this.categoriaObj$, usuario : this.currentUser$, filtros : this.filtroNegocio$ } )
    .subscribe
      (
          (data : any) =>   {
            this.mainArray$ = data.data;
            if( this.mainArray$.length > 0 ){
              this.noRecords$ = false;
            }else{
              this.noRecords$ = true;
            }
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getRegistros(sinvalor){
    if(this.categoriaObj$._id === "cercademi"){
      this.dataService.useService( "get_negocios_cerca_de_mi" , { data : this.categoriaObj$, usuario : this.currentUser$, ubicacion : this.ubicacion$ } )
      .subscribe
        (
            (data : any) =>   {
              this.mainArray$ = data.data;
              if( this.mainArray$.length > 0 ){
                this.noRecords$ = false;
              }else{
                this.noRecords$ = true;
              }
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }else{
      this.dataService.useService( "get_negocios_by_categoria" , { data : this.categoriaObj$, usuario : this.currentUser$, filtros : this.filtroNegocio$, ubicacion : this.ubicacion$ } )
      .subscribe
        (
            (data : any) =>   {
              this.mainArray$ = data.data;
              if( this.mainArray$.length > 0 ){
                this.noRecords$ = false;
              }else{
                this.noRecords$ = true;
              }
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }
  }

  ngOnInit() {

    console.log("LocalStorage");
    console.log(localStorage.getItem('currentUser'));
    console.log(localStorage.getItem('categoriaRestaurantes'));

    this.currentUser$ = this.authenticationService.currentUserValue;

    console.log(history.state);
    if( history.state.categoria ){
      this.categoriaObj$ = history.state.categoria;
    }
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
	
	
	

    console.log("categoria");
    console.log(this.categoriaObj$);

    if( this.categoriaObj$._id === "" ){
      if(localStorage.getItem('categoriaRestaurantes')){
        console.log(1);
        this.categoriaObj$ = JSON.parse(localStorage.getItem('categoriaRestaurantes'));
      }else{
        console.log(2);
        this.router.navigateByUrl('/cliente/seleccion-categoria', { });
      }
    }else{
      console.log(3);
      localStorage.setItem('categoriaRestaurantes', JSON.stringify(this.categoriaObj$));
    }
    this.heading = this.categoriaObj$.nombre.toString();
    this.getRegistros(null);
  }

}
