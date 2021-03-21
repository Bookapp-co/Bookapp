

export class Historial {

  public _id : String;
  public titulo: String;
  public subtitulo: String;
  public fecha: String;

  constructor(
      _id : string = '',
      titulo: string = '',
      subtitulo: string = '',
      fecha: string = '',
  ) {

    this._id              = _id;
    this.titulo           = titulo;
    this.subtitulo        = subtitulo;
    this.fecha            = fecha;

  }
}
