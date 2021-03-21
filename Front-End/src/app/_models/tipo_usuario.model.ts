


export class Tipo_Usuario {

  public _id : String;
  public descripcion: String;

  constructor(
      _id : string = '',
      descripcion: string = ''
  ) {

    this._id              = _id;
    this.descripcion      = descripcion;

  }
}
