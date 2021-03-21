import {Component, HostListener, OnInit} from '@angular/core';
import {ThemeOptions} from '../../../theme-options';
// import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import { Router, ActivatedRoute} from '@angular/router';
import { DataService } from '../../../data.service';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public extraParameter: any;
  currentUser$ : any;
  pedidosArray$: any;
  ioConnection: any;
  contadorPedidosPendientes$ : any;


  constructor(public globals: ThemeOptions, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService, private authenticationService: AuthenticationService) {

  }

  // @select('config') public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = 'dashboardsMenu';

  irA( url_T ){
    this.toggleSidebarMobile();
    this.router.navigateByUrl( url_T , {  });
  }

  toggleSidebarMobile() {
    this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
    console.log(this.globals.sidebarHover);
    console.log(this.globals.toggleSidebarMobile);
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  userLogout(){
    this.authenticationService.logout();
  }

  getPedidosEnCurso(){
    let servicio = "";
    if(this.currentUser$){
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
  }

  initIoConnection(){
    console.log("initIoConnection");
    this.ioConnection = this.dataService.getPedidosPendientes()
    .subscribe((data: any) => {
      console.log("evento de socket recibido");
      this.getPedidosEnCurso();
    });
  }

  ngOnInit() {

    this.currentUser$ = this.authenticationService.currentUserValue;

    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });

    this.extraParameter = this.activatedRoute.snapshot.firstChild.data.extraParameter;
    console.log("extraParameter");
    console.log(this.activatedRoute.snapshot.firstChild.data.extraParameter);

    this.getPedidosEnCurso();
    this.initIoConnection();
    this.contadorPedidosPendientes$ = 0;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }

  }
}
