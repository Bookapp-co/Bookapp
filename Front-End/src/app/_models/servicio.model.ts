


export class Servicio {

  public _id : String;
  public cover: String;
  public icon: String;
  public nombre: String;
  public descripcion: String;
  public categoria_id: String;
  public total: number;
  public costo: number;
  public status: number;

  public promocion : boolean;
  public porcentaje_descuento  : number;

  public anticipo : boolean;
  public anticipo_cantidad : number;

  public decoracion : number;
  public decoracion_cantidad : number;

  constructor(
      _id : string = '',
      cover: string = '',
      icon: string = '',
      nombre: string = '',
      descripcion: string = '',
      categoria_id: string = '',
      total: number = 0,
      costo: number = 0,
      status: number = 1,

      promocion : boolean = false,
      porcentaje_descuento  : number = 0,

      anticipo : boolean = false,
      anticipo_cantidad  : number = 0,

      decoracion  : number = 2,
      decoracion_cantidad  : number = 0,
  ) {

    this._id              = _id;
    this.cover            = cover;
    this.icon             = icon;
    this.nombre           = nombre;
    this.descripcion      = descripcion;
    this.categoria_id     = categoria_id;
    this.total            = total;
    this.costo            = costo;
    this.status           = status;

    this.promocion         = promocion;
    this.porcentaje_descuento = porcentaje_descuento;

    this.anticipo          = anticipo;
    this.anticipo_cantidad = anticipo_cantidad;

    this.decoracion          = decoracion;
    this.decoracion_cantidad = decoracion_cantidad;

  }
}
