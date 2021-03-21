


export class Distancia {

  public _id : String;
  public minimo: String;
  public maximo: String;
  public costo: String;

  constructor( _id : string = '', minimo: string = '', maximo: string = '', costo: string = '' ) {

    this._id          = _id;
    this.minimo       = minimo;
    this.maximo       = maximo;
    this.costo        = costo;

  }
}
