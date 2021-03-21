


export class Especialidad {

  public _id : String;
  public nombre: String;
  public negocio_id: String;
  public especialidad_id: String;

  constructor(
      _id : string = '',
      nombre: string = '',
      negocio_id: string = '',
      especialidad_id: string = '',
  ) {

    this._id        = _id;
    this.nombre     = nombre;
    this.negocio_id = negocio_id;
    this.especialidad_id = especialidad_id;

  }
}
