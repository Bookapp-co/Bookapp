import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

console.log("Accesos Component");

@Component({
  selector: 'seguridad-accesos',
  templateUrl: './accesos.component.html',
})
export class AccesosComponent implements OnInit {

  constructor( private dataService : DataService ){ }

  heading = 'Accesos';
  subheading = 'Administración de los accesos.';
  icon = 'pe-7s-users icon-gradient bg-tempting-azure';
  accesos$: [];

  ngOnInit() {
    // this.dataService.getAccesos()
    // .subscribe
    //   (
    //       data =>   {
    //         this.accesos$ = data.data;
    //         console.log("Accesos");
    //         console.log(this.accesos$);
    //       },
    //       error =>  {
    //         alert("Error");
    //       }
    // );
  }

}
