import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import {animate, query, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'cliente-promocionescliente',
  templateUrl: './promocionescliente.component.html',
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
export class PromocionesClienteComponent implements OnInit {

  mainArray$ = [];
  currentUser$ : any;
  searchText = "";
  promocionesArray$ = [];

  constructor(
    private router                : Router,
    private sanitizer             : DomSanitizer,
    private dataService           : DataService,
    private modalService          : NgbModal,
    private authenticationService : AuthenticationService
    ){
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
    this.getPromociones();
  }

}
