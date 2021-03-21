import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { DataService } from '../../data.service';
import { Usuario } from '../../_models/usuario.model';
import Swal from 'sweetalert2'
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styles: []
})
export class RecuperarComponent implements OnInit {

  @Output() sendMessage: EventEmitter<String> = new EventEmitter<String>();

  mainObj$ = new Usuario();
  step$ = 1;

  slideConfig2 = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };

  constructor(
    private dataService : DataService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit() {

  }

  irA(){
    this.router.navigateByUrl('/pages/login', { });
  }

  cambiarContrasena(){
    if( !this.mainObj$.contrasena ){
      this.dataService.generalAlert({ "message" : "Completa la contraseña.", "status" : "info" });
      return;
    }
    if( !this.mainObj$.contrasena_verifica ){
      this.dataService.generalAlert({ "message" : "Completa la repetición de la contraseña.", "status" : "info" });
      return;
    }
    if( this.mainObj$.contrasena != this.mainObj$.contrasena_verifica ){
      this.dataService.generalAlert({ "message" : "Las contraseñas no coinciden.", "status" : "info" });
      return;
    }
    this.dataService.useService( "cambiar_contrasena" , { data :  this.mainObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.dataService.generalAlert(data);
          if( data.status === "success" ){
            this.dataService.ejecutarModal({ "titulo" : "¡Listo!" , "mensaje" : "Tu contraseña ha sido restablecida" , "tipo" : 1 });
            this.router.navigateByUrl('/pages/login', { });
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  validarCodigo(){
    if( !this.mainObj$.codigo_seguridad ){
      this.dataService.generalAlert({ "message" : "Completa el código de seguridad", "status" : "info" });
      return;
    }
    this.dataService.useService( "validar_codigo_seguridad" , { data :  this.mainObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.dataService.generalAlert(data);
          if( data.status === "success" ){
            this.step$ = 3;
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  recuperar(): void {
    console.log( this.mainObj$ );
    if( !this.mainObj$.correo ){
      this.dataService.generalAlert({ "message" : "Completa tu correo electrónico", "status" : "info" });
      return;
    }
    this.dataService.useService( "recuperar_contrasena" , { data :  this.mainObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.dataService.generalAlert(data);
          if( data.status === "success" ){
            this.step$ = 2;
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
    // AccountKit.recuperar('PHONE', { countryCode: '+52', phoneNumber: '' }).then(
    //   (response: AuthResponse) => this.recuperarCallback(response),
    //   (error: any) => this.dataService.generalAlert({ "message" : "Hubo un error en el inicio de sesión, intenta más tarde", "status" : "error" })
    // );
  }

}
