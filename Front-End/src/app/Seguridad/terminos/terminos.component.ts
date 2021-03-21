import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { DataService } from '../../data.service';
import { Usuario } from '../../_models/usuario.model';
import Swal from 'sweetalert2'
import { AuthenticationService } from '../../_services/authentication.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styles: []
})
export class TerminosComponent implements OnInit {

  @Output() sendMessage: EventEmitter<String> = new EventEmitter<String>();

  mainObj$ = new Usuario();
  terminos$ : any;
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

  constructor(
    private dataService : DataService,
    private authenticationService: AuthenticationService ,
    private router: Router
  ){

  }

  irA(){
    this.authenticationService.redireccionarUsuario(this.currentUser$);
  }

  getTerminos(){
    this.dataService.useService( "get_terminos" , {} )
    .subscribe
      (
        (data : any) =>   {
          this.terminos$ = data.data[0].detalle;
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  ngOnInit() {
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.getTerminos();
  }

}
