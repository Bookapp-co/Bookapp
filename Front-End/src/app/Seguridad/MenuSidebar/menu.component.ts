import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'usuario-menu',
  templateUrl: './menu.component.html',
})
export class MenuSidebarComponent implements OnInit {

  heading = 'MenuSidebar';
  subheading = 'Business administration';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  whatsapp$ : any;

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  currentUser$: any;
  mainArray$: [];
  pedidosArray$: [];
  isActive = false;
  contadorPedidosPendientes$ : any;
  ioConnection: any;

  isAdmin: any;
  isAdminNeg: any;
  isMotofast: any;
  isClient: any;
  activeElement: any;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private authenticationService: AuthenticationService,
    private dataService : DataService,
    private modalService: NgbModal )
  {

  }

  initIoConnection(){
    console.log("initIoConnection");
    this.ioConnection = this.dataService.getPedidosPendientes()
    .subscribe((data: any) => {
      console.log("evento de socket recibido");
      this.getPedidosEnCurso();
    });
  }

  selectedItem(id) {
    this.activeElement = id;
  }

  getPedidosEnCurso(){
    let servicio = "";
    switch( this.currentUser$.tipo_usuario_id ){
      //Admin App
      case "5c4050f358209844a83c8622":
        servicio = "get_pedidos_pendientes_administracion";
      break;
      //Admin Neg
      case "5c4050fa58209844a83c8623":
      case "5e30cadaec6ea3c622235f99":
      case "5e30cadfec6ea3c622235f9a":
      case "5e30cae5ec6ea3c622235f9b":
        servicio = "get_pedidos_pendientes_negocio";
      break;
      //Repartidor
      case "5c40513658209844a83c862a":
        servicio = "get_pedidos_pendientes_motofast";
      break;
      //Cliente
      case "5c40513258209844a83c8629":
        servicio = "get_pedidos_pendientes_usuario";
      break;
    }
    this.dataService.useService( servicio , { data : this.currentUser$ } )
    .subscribe
      (
          (data : any) =>   {
            this.pedidosArray$ = data.data;
            this.contadorPedidosPendientes$ = this.pedidosArray$.length;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  irA( url_t ){
    this.router.navigateByUrl( url_t , { });
  }

  irAPedidos(){
    if( this.isAdmin || this.isAdminNeg || this.isMotofast ){
      this.router.navigateByUrl( '/pedidos/admin' , { });
    }else{
      this.router.navigateByUrl( '/pedidos/listado' , { });
    }
  }

  irAMiComercio(){
    if( this.currentUser$.negocio.main ){
      this.router.navigateByUrl('/administracion/negocio', { state: this.currentUser$.negocio });
    }else{
      this.router.navigateByUrl('/administracion/sucursal', { state: this.currentUser$.negocio });
    }
  }

  userLogout(){
    this.authenticationService.logout();
  }

  getWhatsapp(){
    this.dataService.useService( "get_whatsapp" , {  } )
    .subscribe
      (
          (data : any) =>   {
            this.whatsapp$ = data.data[0].telefono;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    this.currentUser$  = this.authenticationService.currentUserValue;
    this.activeElement = this.authenticationService.getCurrentMenuIndex;
    this.initIoConnection();
    this.getWhatsapp();
    this.contadorPedidosPendientes$ = 0;

    this.isAdmin = false;
    this.isAdminNeg = false;
    this.isMotofast = false;
    this.isClient = false;

    if( this.currentUser$ ){
      switch( this.currentUser$.tipo_usuario_id ){
        //Admin App
        case "5c4050f358209844a83c8622":
          this.isAdmin = true;
        break;
        //Admin Neg
        case "5c4050fa58209844a83c8623":
          this.isAdminNeg = true;
        break;
        //Repartidor
        case "5c40513658209844a83c862a":
          this.isMotofast = true;
        break;
        //Cliente
        case "5c40513258209844a83c8629":
          this.isClient = true;
        break;
      }
    }
  }

}
