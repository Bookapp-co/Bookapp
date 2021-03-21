
import { Tipo_Moneda } from './tipo_moneda.model';

export class Configuracion {

  public _id : String;

  public pide_lo_que_quieras      : boolean;
  public negocio_propio_delivery  : boolean;
  public tracking_de_pedidos      : boolean;
  public tipo_de_moneda           : Tipo_Moneda;
  public tipo_de_moneda_id        : String;
  public incentivos_repartidores  : boolean;

  public terminos_archivo         : String;
  public terminos_archivo_url     : String;

  public politicas_archivo        : String;
  public politicas_archivo_url    : String;

  public foto: String;
  public mensaje_inicio: String;
  public activar_promo_inicio: boolean;

  public correo_notificaciones : String;
  public costo_publicidad: number;

  constructor(

    _id                     : string = '',

    pide_lo_que_quieras     : boolean = false,
    negocio_propio_delivery : boolean = false,
    tracking_de_pedidos     : boolean = false,
    tipo_de_moneda          : Tipo_Moneda = new Tipo_Moneda(),
    incentivos_repartidores : boolean = false,

    terminos_archivo        : string = '',
    terminos_archivo_url    : string = '',

    politicas_archivo       : string = '',
    politicas_archivo_url   : string = '',

    foto: string = '',
    mensaje_inicio: string = '',
    activar_promo_inicio: boolean = false,

    correo_notificaciones   : string = '',
    costo_publicidad: number = 0,

  ) {

    this._id                     = _id;

    this.pide_lo_que_quieras     = pide_lo_que_quieras;
    this.negocio_propio_delivery = negocio_propio_delivery;
    this.tracking_de_pedidos     = tracking_de_pedidos;
    this.tipo_de_moneda          = tipo_de_moneda;
    this.incentivos_repartidores = incentivos_repartidores;

    this.terminos_archivo        = terminos_archivo;
    this.terminos_archivo_url    = terminos_archivo_url;

    this.politicas_archivo       = politicas_archivo;
    this.politicas_archivo_url   = politicas_archivo_url;

    this.foto                   = foto;
    this.mensaje_inicio         = mensaje_inicio;
    this.activar_promo_inicio   = activar_promo_inicio;

    this.correo_notificaciones  = correo_notificaciones;
    this.costo_publicidad  = costo_publicidad;

  }
}
