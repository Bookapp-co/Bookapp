
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 9; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export class Ingrediente {

  public id: String;
  public nombre: String;
  public nuevo: boolean;
  public disponible: boolean;
  public extra: number;

  constructor(
      nombre: string = '',
      nuevo : boolean = false,
      disponible : boolean = false,
      extra: number = 0
  ) {

    this.id           = makeid();
    this.nombre       = nombre;
    this.nuevo        = nuevo;
    this.disponible   = nuevo;
    this.extra        = extra;
  }
}
