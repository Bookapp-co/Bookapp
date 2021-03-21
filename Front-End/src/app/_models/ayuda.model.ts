


export class Ayuda {

  public _id : String; 
  public nombre: String;
  public correo: String;
  public asunto: String;

  constructor(
    _id : string = '',
    nombre: string = '',
    correo: string = '',
    asunto: string = ''
  ) {

    this._id          = _id;
    this.nombre       = nombre;
    this.correo       = correo;
    this.asunto       = asunto;

  }
}
