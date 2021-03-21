


export class Punto {

  public _id : String;
  public mayor_a: String;
  public puntos: String;
  public negocio_id: String;

  constructor(
    _id : string = '',
    mayor_a: string = '',
    puntos: string = '',
    negocio_id: string = ''
  ) {

    this._id          = _id;
    this.mayor_a      = mayor_a;
    this.puntos       = puntos;
    this.negocio_id   = negocio_id;

  }
}
