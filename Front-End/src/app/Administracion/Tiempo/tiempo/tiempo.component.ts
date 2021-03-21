/// <reference types="@types/googlemaps
import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Tiempo } from '../../../_models/tiempo.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'tiempo-acceso',
  templateUrl: './tiempo.component.html',
})

export class TiempoComponent implements OnInit {

  mainObj$ = new Tiempo();
  mainObjParam$ = new Tiempo();
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
      this.dataService.useService( "borrar_tiempo" , { data : this.mainObj$ } )
      .subscribe
        (
            (data : any) =>   {
              this.dataService.generalAlert(data);
              this.router.navigateByUrl('/administracion/tiempos', { });
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
    if( !this.mainObj$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre.", "status" : "error" } );
      return;
    }
    if( !this.mainObj$.minutos ){
      this.dataService.generalAlert( { "message" : "Completa los minutos.", "status" : "error" } );
      return;
    }
    this.dataService.useService( "actualizar_tiempo" , { data : this.mainObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.dataService.generalAlert(data);
            this.router.navigateByUrl('/administracion/tiempos', { });
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {
    console.log("Param on init tiempo");
    console.log(history.state);
    if( history.state._id ){
      this.mainObj$ = history.state;
    }
    this.currentUser$ = this.authenticationService.currentUserValue;
  }

}
