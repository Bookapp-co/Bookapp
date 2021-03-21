
export class Precio_Decoracion {

  public _id : String;
  public costo: number;
  public numero_personas_desde: number;
  public numero_personas_hasta: number;
  public anticipo: number;

  constructor(
      _id : string = '',
      costo: number = 0,
      numero_personas_desde: number = 0,
      numero_personas_hasta: number = 0,
      anticipo: number = 0,
  ) {

    this._id                = _id;
    this.costo              = costo;
    this.numero_personas_desde    = numero_personas_desde;
    this.numero_personas_hasta    = numero_personas_hasta;
    this.anticipo           = anticipo;

  }
}
