import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Ubicacion } from '../../_models/ubicacion.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './ubicaciones.component.html',
})
export class UbicacionesComponent implements OnInit {

  currentUser$: any;
  modalReference: any;
  ubicacion$ = new Ubicacion();
  mainArray$  = [];
  ubicacionSeleccionado$: any;
  regresarUrl$: any;
  isActive = false;
  myLocation$ = false;

  @ViewChild('mDireccion') mDireccion: TemplateRef<any>;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private dataService : DataService,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService
  ){ }

  irAInicioSesion(){
    this.router.navigateByUrl('/pages/login', { });
  }

  irARegistroCliente(){
    this.router.navigateByUrl('/pages/registro', { state : { tipo : 1 } });
  }

  irA(){
    if( this.regresarUrl$ ){
      this.router.navigateByUrl( this.regresarUrl$ , { state : { get_pedido_guardado : true } });
    }else{
      this.authenticationService.redireccionarUsuario(this.currentUser$);
    }
  }

  abrirUbicacion(ubicacion_t, ubicacion_actual){
    if( !ubicacion_t ){
      this.ubicacion$ = new Ubicacion();
    }else{
      this.ubicacion$ = ubicacion_t;
    }
    this.myLocation$  = ubicacion_actual;
    this.modalReference = this.modalService.open(this.mDireccion, {windowClass: 'cgk-modal-full'});
  }

  seleccionarDireccion(nuevasCoordenadasT){
    this.ubicacion$.direccion      = nuevasCoordenadasT.direccion;
    this.ubicacion$.latitude       = nuevasCoordenadasT.latitude;
    this.ubicacion$.longitude      = nuevasCoordenadasT.longitude;
    this.ubicacion$.referencia     = nuevasCoordenadasT.referencia;
	if( this.currentUser$ ){		
		this.currentUser$.direccion    = nuevasCoordenadasT.direccion;
		this.currentUser$.latitude     = nuevasCoordenadasT.latitude;
		this.currentUser$.longitude    = nuevasCoordenadasT.longitude;
		this.currentUser$.referencia   = nuevasCoordenadasT.referencia;
		this.dataService.useService( "actualizar_ubicacion_usuario" , { usuario : this.currentUser$ } )
		.subscribe
		  (
			  (data : any) =>   {
				this.currentUser$.direccion_id = data.direccion_id;
				this.authenticationService.changeUserInfo(this.currentUser$);
				console.log(this.regresarUrl$);
				if( this.regresarUrl$ ){
				  this.router.navigateByUrl( this.regresarUrl$ , { state : { get_pedido_guardado : true } });
				}else{
				  this.authenticationService.redireccionarUsuario(this.currentUser$);
				}
				this.getRegistros();
			  },
			  error =>  {
			  }
		);
	}else{
		this.router.navigate(['cliente/seleccion-categoria'], { state : { ubicacion : this.ubicacion$ } });
	}    
    this.modalReference.close();
  }

  cambiarDireccion(direccion_t){
    this.currentUser$.direccion_id = direccion_t._id;
    this.currentUser$.direccion    = direccion_t.direccion;
    this.currentUser$.latitude     = direccion_t.latitude;
    this.currentUser$.longitude    = direccion_t.longitude;
    this.currentUser$.referencia   = direccion_t.referencia;
    this.dataService.useService( "actualizar_direccion_usuario" , { usuario : this.currentUser$, direccion : direccion_t } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.ejecutarModal({ "titulo" : "¡Listo!" , "mensaje" : "Su ubicación ha sido guardada." , "mostrar_imagen" : true, "url_imagen" : "https://codigeek.com/projects/bookapp/ilustracion_home.png", "tipo" : 1 });
            this.authenticationService.changeUserInfo(this.currentUser$);
            console.log(this.regresarUrl$);
            if( this.regresarUrl$ ){
              this.router.navigateByUrl( this.regresarUrl$ , { state : { get_pedido_guardado : true } });
            }else{
              this.authenticationService.redireccionarUsuario(this.currentUser$);
            }
            this.modalReference.close();
            this.getRegistros();
          },
          error =>  {
          }
    );
  }

  eliminarDireccion(direccion_t){
    this.dataService.useService( "eliminar_direccion" , { usuario : this.currentUser$, direccion : direccion_t } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            if( data.status === "success" ){
              this.dataService.useService( "get_direcciones_usuario" , { usuario : this.currentUser$ } )
              .subscribe
                (
                    (data : any) =>   {
                      this.mainArray$ = data.data;
                      this.currentUser$.direccion_id =  data.data[0]._id;
                      this.currentUser$.direccion    =  data.data[0].direccion;
                      this.currentUser$.latitude     =  data.data[0].latitude;
                      this.currentUser$.longitude    =  data.data[0].longitude;
                      this.currentUser$.referencia   =  data.data[0].referencia;
                      this.modalReference.close();
                      this.authenticationService.changeUserInfo(this.currentUser$);
                    },
                    error =>  {
                      this.dataService.generalAlert(error);
                    }
              );
            }
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getRegistros(){
    this.dataService.useService( "get_direcciones_usuario" , { usuario : this.currentUser$ } )
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

  ngOnInit() {
    this.regresarUrl$ = history.state.regresar;
    this.currentUser$ = this.authenticationService.currentUserValue;
    console.log(this.currentUser$);
    if( this.currentUser$ ){
      this.getRegistros();
    }
  }

}
