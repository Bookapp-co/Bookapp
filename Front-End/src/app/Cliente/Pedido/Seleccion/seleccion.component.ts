import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Servicio } from '../../../_models/servicio.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'cliente-seleccion',
  templateUrl: './seleccion.component.html',
})
export class SeleccionComponent implements OnInit {

  mainObject$ = new Servicio();
  mainArray$: [];
  pedidosArray$: [];
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

  constructor( private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal, private authenticationService: AuthenticationService ){ }

  irAPedidos(){
    this.router.navigateByUrl('/pedidos/listado', {  });
  }

  seleccionarServicio( registro_t ){
    if( registro_t._id === "5c48462e593631d8929d0a6b" ){
      this.router.navigateByUrl('/cliente/pideloquequieras', { state: registro_t });
    }else{
      this.router.navigateByUrl('/cliente/seleccion-categoria', { state: registro_t });
    }
  }

  getPedidosEnCurso(){
    this.dataService.useService( "get_pedidos_pendientes_usuario" , { data : this.currentUser$ } )
    .subscribe
      (
          (data : any) =>   {
            this.pedidosArray$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getRegistros(){
    this.dataService.useService( "get_servicios" , {  } )
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
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getRegistros();
    this.getPedidosEnCurso();
  }

}
