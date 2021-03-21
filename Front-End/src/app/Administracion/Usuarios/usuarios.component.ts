import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../../_models/usuario.model';
import { Filtro_Usuario } from '../../_models/filtro_usuario.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {

  heading = 'Usuarios';
  subheading = 'Administración de las empresas';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  mainObject$ = new Usuario();
  filtroUsuario$ = new Filtro_Usuario();
  mainArray$ = [];
  mainArray2$ = [];
  usuarioSeleccionado$: any;
  currentUser$ : any;
  isActive = false;
  filtroTipo = "TODOS";
  searchText = "";

  constructor( private authenticationService: AuthenticationService, private router: Router, private sanitizer: DomSanitizer, private dataService : DataService, private modalService: NgbModal ){ }

  abrirUbicacion(){
    this.router.navigate(['pages/ubicaciones'], { state : { regresar : '/administracion/usuarios' } });
  }

  limpiarFiltros(){
    this.filtroUsuario$ = new Filtro_Usuario();
  }

  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("modal_closed");
    }, (reason) => {
      console.log("exit");
    });
  }

  filtroCambio(event_t){
    // console.log(event_t);
    // if( event_t.value === "TODOS" ){
    //   this.mainArray$ = this.mainArray2$;
    // }else{
    //   this.mainArray$ = this.mainArray2$.filter(function (el) {
    //     return el.tipo_usuario_id === event_t.value;
    //   });
    // }
  }

  nuevoRegistro(){

    this.mainObject$ = new Usuario();
    this.router.navigateByUrl('/administracion/usuario', { state: this.mainObject$ });

  }

  editarRegistro( registroEditar ){

    this.router.navigateByUrl('/administracion/usuario', { state: registroEditar });

  }

  borrarRegistro( mBorrar, registroBorrar ){

    this.mainObject$ = registroBorrar;
    this.modalReference = this.modalService.open(mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_empresa" , { data : this.mainObject$ } )
      .subscribe
        (
            (data : any) =>   {
              mainObject$ : new Usuario();
              this.dataService.generalAlert(data);
              this.getRegistros();
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }, (reason) => {
      console.log("exit");
    });

  }

  getRegistros(){
    if(this.filtroUsuario$.ubicacion){
      if( !this.currentUser$.latitude ){
        this.dataService.generalAlert( { "message" : "Captura la ubicación.", "status" : "error" } );
        return;
      }
      this.filtroUsuario$.latitude  = this.currentUser$.latitude;
      this.filtroUsuario$.longitude = this.currentUser$.longitude;
      this.filtroUsuario$.direccion = this.currentUser$.direccion;
    }
    this.dataService.useService( "get_usuarios" , { filtro : this.filtroUsuario$ } )
    .subscribe
      (
          (data : any) =>   {
            this.mainArray$ = data.data;
            this.mainArray2$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getRegistros();
  }

}
