import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

console.log("Usuarios Component");

@Component({
  selector: 'seguridad-usuarios',
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {

  constructor( private dataService : DataService ){ }

  heading = 'Usuarios';
  subheading = 'Administración de los usuarios.';
  icon = 'pe-7s-users icon-gradient bg-tempting-azure';
  usuarios$: [];

  ngOnInit() {
    // this.dataService.getUsuarios()
    // .subscribe
    //   (
    //       data =>   {
    //         this.usuarios$ = data.data;
    //         console.log("usuarios");
    //         console.log(this.usuarios$);
    //       },
    //       error =>  {
    //         alert("Error");
    //       }
    // );
  }

}
