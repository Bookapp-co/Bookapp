import { Component, OnInit, ViewChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { Referido } from '../../_models/referido.model';
import { Negocio } from '../../_models/negocio.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2'
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-referido',
  templateUrl: './referido.component.html',
  styles: []
})
export class ReferidoComponent implements OnInit {

  @Output() sendMessage: EventEmitter<String> = new EventEmitter<String>();

  mainObj$ = new Referido();
  negocioObj$ = new Negocio();
  tipoVista$ = 1;

  categoriasArray$ = [];
  modalReference : any;
  currentUser$ : any;

  slideConfig2 = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };

  @ViewChild('listadoCategorias') listadoCategorias: TemplateRef<any>;

  constructor(
    private dataService : DataService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
  }

  regresar(){
    this.authenticationService.redireccionarUsuario(this.currentUser$);
  }

  guardarReferido(): void {
    if( !this.mainObj$.nombre ){
      this.dataService.generalAlert({ "message" : "Completa el nombre del comercio", "status" : "info" });
      return;
    }
    if( !this.mainObj$.contacto ){
      this.dataService.generalAlert({ "message" : "Completa el contacto del comercio", "status" : "info" });
      return;
    }
    if( !this.mainObj$.telefono ){
      this.dataService.generalAlert({ "message" : "Completa el teléfono del comercio", "status" : "info" });
      return;
    }
    if( !this.mainObj$.direccion ){
      this.dataService.generalAlert({ "message" : "Completa la dirección del comercio", "status" : "info" });
      return;
    }
    this.dataService.useService( "nuev_referido" , { data :  this.mainObj$, usuario : this.currentUser$ } )
    .subscribe
      (
        (data : any) =>   {
          this.dataService.generalAlert(data);
          this.dataService.ejecutarModal({ "titulo" : "¡Listo!" , "mensaje" : "Gracias por enviar tu referido, te contactaremos a la brevedad." , "mostrar_icono" : true, "tipo" : 1 });
          this.authenticationService.redireccionarUsuario(this.currentUser$);
        },
        error =>  {
          this.dataService.generalAlert({ "message" : error, "status" : "error" });
        }
    );
  }

}
