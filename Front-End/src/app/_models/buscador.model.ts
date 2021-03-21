
export class Buscador {

  public _id : String;
  public nombre: String;

  constructor(
      _id : string = '',
      nombre: string = '',
  ) {

    this._id                = _id;
    this.nombre             = nombre;

  }
}
