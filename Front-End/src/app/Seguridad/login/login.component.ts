import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef, Injectable, EventEmitter, Output   } from '@angular/core';
import { DataService } from '../../data.service';
import { Usuario } from '../../_models/usuario.model';
import { Configuracion } from '../../_models/configuracion.model';
import Swal from 'sweetalert2'
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbTabset, NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  @Output() sendMessage: EventEmitter<String> = new EventEmitter<String>();

  mainObj$ = new Usuario();
  modalReference: any;
  configuracion$ = new Configuracion();

  slideConfig2 = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };

  @ViewChild('mTest') mTest: TemplateRef<any>;

  constructor(
    private dataService : DataService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal
  ){

  }

  abrirLink( tipo_t ){
    if( tipo_t === 1 ){
      window.open( this.configuracion$.terminos_archivo_url.toString() , "_system");
    }
    if( tipo_t === 2 ){
      window.open( this.configuracion$.politicas_archivo_url.toString() , "_system");
    }
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

  ngOnInit() {
    this.getConfiguracion();
  }

  irARegistroCliente(){
    this.router.navigateByUrl('/pages/registro', { state : { tipo : 1 } });
  }

  irARegistroNegocio(){
    this.router.navigateByUrl('/pages/registro', { state : { tipo : 2 } });
  }

  irA(tipo_t){
    if( tipo_t === 1 ){
      this.router.navigateByUrl('/pages/registro', { state : { tipo : 1 } });
    }
    if( tipo_t === 2 ){
      this.router.navigateByUrl('/pages/recuperar', {  });
    }
    if( tipo_t === 3 ){
      this.router.navigateByUrl('/pages/terminos', { });
    }
  }

  login_prueba(tel_t): void {
    this.dataService.useService( "autenticacion_prueba" , { data :  { "celular_prueba" : tel_t } } )
    .subscribe
      (
          data =>   {
            this.dataService.generalAlert({ "message" : "Bienvenido", "status" : "success" });
            this.authenticationService.setUser((data as any).data);
          },
          error =>  {
            this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" });
          }
    );
  }

  loginCallback( response ) {
		if (response.status === "PARTIALLY_AUTHENTICATED") {

        this.dataService.autenticacion( response )
        .subscribe
          (
              data =>   {
                this.dataService.generalAlert({ "message" : "Bienvenido", "status" : "success" });
                this.authenticationService.setUser((data as any).data);
              },
              error =>  {
                this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" });
              }
        );

		  	// Data.nodePost('autenticacion', { data : response })
    		// .then(function (results) {
  			//   if (results.status === "success") {
  			// 	  // console.log(results);
  			// 	  	$scope.userContext = results.data;
  			// 	  	UserContext.authenticationUser(results.data, true);
  			// 	  	$localStorage.usuario_conectado = $scope.userContext;
  			// 	  	$rootScope.show_loader = false;
  			// 		if($localStorage.usuario_conectado.nombre === "Agregar mi nombre" || (!$localStorage.usuario_conectado.customer_id) || (!$localStorage.usuario_conectado.direccion_id ) ){
  			// 				$state.go("pass.completar_perfil");
  			// 		}else{
  			// 			$state.go("app.usuario_inicio");
  			// 		}
  			//   }else{
  			// 	  Data.toast( { "status"  : "success",  "message" : "Error al iniciar sesión."  } );
  			//   }
			 // });
		}
		else if (response.status === "NOT_AUTHENTICATED") {
      this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" });
		}
		else if (response.status === "BAD_PARAMS") {
      this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" });
		}
  }

  registrarme(): void {
    console.log( this.mainObj$ );
    if( !this.mainObj$.correo ){
      this.dataService.generalAlert({ "message" : "Completa tu correo electrónico", "status" : "info" });
      return;
    }
    if( !this.mainObj$.contrasena ){
      this.dataService.generalAlert({ "message" : "Completa tu contraseña", "status" : "info" });
      return;
    }
    if( !this.mainObj$.nombre ){
      this.dataService.generalAlert({ "message" : "Completa tu nombre", "status" : "info" });
      return;
    }
    if( !this.mainObj$.telefono ){
      this.dataService.generalAlert({ "message" : "Completa tu teléfono", "status" : "info" });
      return;
    }
    this.dataService.useService( "registro" , { data :  this.mainObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.dataService.generalAlert(data);
          if( data.status === "success" ){
            this.dataService.generalAlert({ "message" : "Bienvenido", "status" : "success" });
            this.authenticationService.setUser((data as any).data);
          }
        },
        error =>  {
          this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" });
        }
    );
  }

  login(): void {
    console.log( this.mainObj$ );
    if( !this.mainObj$.correo ){
      this.dataService.generalAlert({ "message" : "Completa tu correo electrónico", "status" : "info" });
      return;
    }
    if( !this.mainObj$.contrasena ){
      this.dataService.generalAlert({ "message" : "Completa tu contraseña", "status" : "info" });
      return;
    }
    this.dataService.useService( "autenticacion_correo_negocio" , { data :  this.mainObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.dataService.generalAlert(data);
          if( data.status === "success" ){
            this.dataService.generalAlert({ "message" : "Bienvenido", "status" : "success" });
            this.authenticationService.setUser((data as any).data);
          }
        },
        error =>  {
          this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" });
          this.dataService.generalAlert({ "message" : error, "status" : "error" });
        }
    );
    // AccountKit.login('PHONE', { countryCode: '+52', phoneNumber: '' }).then(
    //   (response: AuthResponse) => this.loginCallback(response),
    //   (error: any) => this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" })
    // );
  }

}
