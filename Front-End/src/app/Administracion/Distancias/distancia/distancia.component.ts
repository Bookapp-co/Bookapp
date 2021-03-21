/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Distancia } from '../../../_models/distancia.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'distancia-acceso',
  templateUrl: './distancia.component.html',
})

export class DistanciaComponent implements OnInit {

  mainObj$ = new Distancia();
  mainObjParam$ = new Distancia();
  mainArray$: [];
  currentUser$ : any;
  modalReference: any;

  public imagePath;
  imgURL: any;
  public isActive: any;

  @ViewChild('mBorrar') mBorrar: TemplateRef<any>;

  constructor( private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
  }

  borrar(){
    this.modalReference = this.modalService.open(this.mBorrar);
    this.modalReference.result.then((result) => {
      this.dataService.useService( "borrar_distancia" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/administracion/distancias', { });
            },
            error =>  {
              this.dataService.generalAlert(error);
            }
      );
    }, (reason) => {
      console.log("exit");
    });
  }

  guardar(){
    if( !this.mainObj$.minimo ){
      this.dataService.generalAlert( { "message" : "Completa el mínimo.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.maximo ){
      this.dataService.generalAlert( { "message" : "Completa el máximo.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.costo ){
      this.dataService.generalAlert( { "message" : "Completa el costo.", "status" : "error" } );
      return;
    }
    this.dataService.useService( "actualizar_distancia" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/administracion/distancias', { });
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    console.log("Param on init distancia");
    console.log(history.state);
    if( history.state._id ){
      this.mainObj$ = history.state;
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
  }

}
