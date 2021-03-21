import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { DataService } from '../../data.service';
import { Usuario } from '../../_models/usuario.model';
import Swal from 'sweetalert2'
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styles: []
})
export class InicioComponent implements OnInit {

  @Output() sendMessage: EventEmitter<String> = new EventEmitter<String>();

  mainObj$ = new Usuario();

  slideConfig2 = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };

  constructor( private dataService : DataService, private authenticationService: AuthenticationService ) {
  }

  ngOnInit() {
    console.log("Inicio test");
  }

  inicio_prueba(tel_t): void {
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

  inicioCallback( response ) {
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

  inicio(): void {
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
    // AccountKit.inicio('PHONE', { countryCode: '+52', phoneNumber: '' }).then(
    //   (response: AuthResponse) => this.inicioCallback(response),
    //   (error: any) => this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" })
    // );
  }

}
