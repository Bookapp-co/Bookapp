

export class Referido {

  public _id : String;
  public nombre: String;
  public contacto: String;
  public telefono: String;
  public direccion: String;

  constructor(
      _id : string = '',
      nombre: string = '',
      contacto: string = '',
      telefono: string = '',
      direccion: string = '',
  ) {

    this._id              = _id;
    this.nombre           = nombre;
    this.contacto         = contacto;
    this.telefono         = telefono;
    this.direccion        = direccion;

  }
}
