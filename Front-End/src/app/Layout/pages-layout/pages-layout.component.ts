import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef, Injectable, EventEmitter, Output   } from '@angular/core';
import {animate, query, style, transition, trigger} from '@angular/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../data.service';

console.log("Pages Layout Component");

@Component({
  selector: 'app-pages-layout',
  templateUrl: './pages-layout.component.html',
  animations: [

    trigger('architectUIAnimation', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            opacity: 0,
            display: 'flex',
            flex: '1',
            flexDirection: 'column'

          }),
        ]),
        query(':enter', [
          animate('600ms ease', style({opacity: 1})),
        ]),

        query(':leave', [
          animate('600ms ease', style({opacity: 0})),
        ], {optional: true})
      ]),
    ])
  ]
})

export class PagesLayoutComponent implements OnInit {

  modalReference : any;

  tituloModal$  : any;
  mensajeModal$ : any;
  tipoModal$    : any;
  modalOpened$            = false;
  mostrarIcono$           = false;
  mostrarImagen$          = false;
  urlImagen$              = false;

  @ViewChild('mMensajeGeneral') mMensajeGeneral: TemplateRef<any>;

  constructor(
    private dataService : DataService,
    private modalService: NgbModal
  ) {
    
  }

  triggerMensajeGeneral(data){

    console.log("triggerMensajeGeneral");

    this.tituloModal$     = data.titulo;
    this.mensajeModal$    = data.mensaje;
    this.tipoModal$       = data.tipo;
    this.mostrarIcono$    = data.mostrar_icono;
    this.mostrarImagen$   = data.mostrar_imagen;
    this.urlImagen$       = data.url_imagen;

    this.modalReference = this.modalService.open(
      this.mMensajeGeneral,
      {windowClass: 'cgk-modal-full', backdrop: false}
    );
    this.modalReference.result.then((result) => {
    }, (reason) => {
      console.log("exit");
    });
  }

  closeModal(){
    this.modalReference.close();
  }

  ngOnInit() {
  }

}
