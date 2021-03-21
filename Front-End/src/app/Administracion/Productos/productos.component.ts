import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Platillo } from '../../_models/platillo.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {

  heading = 'Productos';
  subheading = 'Administración del menú';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  currentUser$: any;
  mainObject$ = new Platillo();
  mainObj$ : any;
  mainArray$: [];
  platilloSeleccionado$: any;
  isActive = false;

  constructor( private router: Router, private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private dataService : DataService, private modalService: NgbModal ){ }


  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
    }, (reason) => {
    });
  }

  nuevoRegistro(){

    this.mainObject$ = new Platillo();
    this.router.navigateByUrl('/administracion/catalogos-producto', { state: { categoria : this.mainObj$, producto : this.mainObject$ } });

  }

  editarRegistro( registroEditar ){

    this.router.navigateByUrl('/administracion/catalogos-producto', { state: { categoria : this.mainObj$, producto : registroEditar } });

  }

  getRegistros(){
    this.dataService.useService( "get_productos_catalogo" , { data : this.mainObj$ } )
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
    if( history.state._id ){
      this.mainObj$ = history.state;
      this.heading = this.heading + " de " + this.mainObj$.nombre;
    }else{
      this.router.navigateByUrl('/administracion/catalogos', { });
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getRegistros();
  }

}
