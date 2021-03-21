import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from '../../_models/categoria.model';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'administracion-empresas',
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent implements OnInit {

  heading = 'Categorias';
  subheading = 'Administración de las categorías';
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  @ViewChild('ngxLoading') ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate') customLoadingTemplate: TemplateRef<any>;

  @ViewChild('content') templateEditarRegistro: TemplateRef<any>;
  @ViewChild('mBorrar') templateBorrarRegistro: TemplateRef<any>;

  modalReference: any;
  currentUser$: any;
  mainObject$ = new Categoria();
  mainArray$: [];
  categoriaSeleccionado$: any;
  isActive = false;

  mainObj$ = new Categoria();

  constructor( private router: Router, private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private dataService : DataService, private modalService: NgbModal ){ }


  open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      console.log("modal_closed");
    }, (reason) => {
      console.log("exit");
    });
  }

  nuevoRegistro(){

    this.mainObject$ = new Categoria();
    this.router.navigateByUrl('/administracion/catalogos-categoria', { state: { catalogo : this.mainObj$, categoria : this.mainObject$ } });

  }

  editarRegistro( registroEditar ){

    this.router.navigateByUrl('/administracion/catalogos-categoria', { state: { catalogo : this.mainObj$, categoria : registroEditar } });

  }

  getRegistros(){
    this.dataService.useService( "get_categorias_catalogo" , { data : this.mainObj$ } )
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
