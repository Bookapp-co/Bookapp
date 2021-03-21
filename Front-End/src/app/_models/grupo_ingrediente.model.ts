
import { Ingrediente } from './ingrediente.model';

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 9; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export class Grupo_Ingrediente {

  public id: String;
  public nombre: String;
  public seleccion_multiple: boolean;
  public nuevo: boolean;
  public genera_costo: boolean;
  public ingredientes : Ingrediente[];

  constructor(
      nombre: string = '',
      seleccion_multiple : boolean = false,
      nuevo : boolean = false,
      genera_costo : boolean = false,
      ingredientes: Ingrediente[] = []
  ) {

    this.id                   = makeid();
    this.nombre               = nombre;
    this.nuevo                = nuevo;
    this.genera_costo         = genera_costo;
    this.seleccion_multiple   = seleccion_multiple;
    this.ingredientes         = ingredientes;

  }
}
