
import { Forma_Pago } from './forma_pago.model';

export class Publicidad {

  public _id : String;
  public nombre: String;
  public negocio_id: String;
  public foto: String;
  public status: number;
  public forma_pago: Forma_Pago;
  public forma_pago_id: String;
  public tarjeta: Object;
  public tarjeta_id: String;
  public fecha_alta: Date;
  public fecha_actualizacion: Date;

  constructor(
    _id : string = '',
    nombre: string = '',
    negocio_id: string = '',
    foto: string = '',
    status: number = 1,
    forma_pago: Forma_Pago = new Forma_Pago(),
    forma_pago_id: string = '',
    tarjeta: string = '',
    tarjeta_id: string = '',
    fecha_alta: Date = new Date(),
    fecha_actualizacion: Date = new Date(),
  ){

    this._id           = _id;
    this.nombre        = nombre;
    this.negocio_id    = negocio_id;
    this.foto          = foto;
    this.status        = status;
    this.forma_pago    = forma_pago;
    this.forma_pago_id = forma_pago_id;
    this.tarjeta       = tarjeta;
    this.tarjeta_id    = tarjeta_id;
    this.fecha_alta    = fecha_alta;
    this.fecha_actualizacion    = fecha_actualizacion;

  }
}
