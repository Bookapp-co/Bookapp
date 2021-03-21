

import { Platillo } from './platillo.model';
import { SubCategoria } from './subcategoria.model';
import { Tiempo } from './tiempo.model';
import { Servicio } from './servicio.model';
import { Precio_Decoracion } from './precio_decoracion.model';
import { Especialidad } from './especialidad.model';

export class Categoria {

  public _id : String;
  public nombre: String;
  public negocio_id: String;
  public usuario_id: String;
  public categoria: SubCategoria;
  public categoria_id: String;
  public especialidad: Especialidad;
  public especialidad_id: String;
  public tiempo: Tiempo;
  public tiempo_id: String;
  public tiempo_alquilacion: Tiempo;
  public tiempo_alquilacion_id: String;
  public tiempo_tolerancia: Tiempo;
  public tiempo_tolerancia_id: String;
  public servicio: Servicio;
  public servicio_id: String;
  public foto: String;
  public foto_promocion: String;
  public status: number;
  public expand : boolean;
  public tipo_listado : number;
  public platillos : Platillo[];

  public duracion_cita: number;
  public costo: number;

  public promocion : boolean;
  public detalle_promocion  : String;
  public aplica_porcentaje : boolean;
  public porcentaje_descuento  : number;

  public anticipo : boolean;
  public anticipo_cantidad : number;

  public decoracion : number;
  public decoracion_cantidad : number;

  public precio_decoracion : Precio_Decoracion[];

  constructor(
    _id : string = '',
    nombre: string = '',
    negocio_id: string = '',
    usuario_id: string = '',
    categoria: SubCategoria = new SubCategoria(),
    categoria_id: string = '',
    especialidad: Especialidad = new Especialidad(),
    especialidad_id: string = '',
    tiempo: Tiempo = new Tiempo(),
    tiempo_id: string = '',
    tiempo_alquilacion: Tiempo = new Tiempo(),
    tiempo_alquilacion_id: string = '',
    tiempo_tolerancia: Tiempo = new Tiempo(),
    tiempo_tolerancia_id: string = '',
    servicio: Servicio = new Servicio(),
    servicio_id: string = '',
    foto: string = '',
    foto_promocion: string = '',
    status: number = 1,
    expand : boolean = false,
    tipo_listado: number = 1,
    platillos: Platillo[] = [],

    duracion_cita: number = 0,
    costo: number = 0,

    promocion : boolean = false,
    detalle_promocion: string = '',
    aplica_porcentaje : boolean = false,
    porcentaje_descuento  : number = 0,

    anticipo : boolean = false,
    anticipo_cantidad  : number = 0,

    decoracion  : number = 2,
    decoracion_cantidad  : number = 0,

    precio_decoracion: Precio_Decoracion[] = [],

  ){

    this._id          = _id;
    this.nombre       = nombre;
    this.negocio_id   = negocio_id;
    this.usuario_id   = usuario_id;
    this.categoria    = categoria;
    this.categoria_id = categoria_id;
    this.especialidad = especialidad;
    this.especialidad_id = especialidad_id;
    this.tiempo       = tiempo;
    this.tiempo_id    = tiempo_id;
    this.tiempo_alquilacion = tiempo_alquilacion;
    this.tiempo_alquilacion_id = tiempo_alquilacion_id;
    this.tiempo_tolerancia = tiempo_tolerancia;
    this.tiempo_tolerancia_id = tiempo_tolerancia_id;
    this.servicio     = servicio;
    this.servicio_id  = servicio_id;
    this.foto         = foto;
    this.foto_promocion = foto_promocion;
    this.status       = status;
    this.expand       = expand;
    this.tipo_listado = tipo_listado;
    this.platillos    = platillos;

    this.duracion_cita     = duracion_cita;
    this.costo             = costo;

    this.promocion         = promocion;
    this.detalle_promocion = detalle_promocion;
    this.aplica_porcentaje = aplica_porcentaje;
    this.porcentaje_descuento = porcentaje_descuento;

    this.anticipo          = anticipo;
    this.anticipo_cantidad = anticipo_cantidad;

    this.decoracion          = decoracion;
    this.decoracion_cantidad = decoracion_cantidad;

    this.precio_decoracion = precio_decoracion;

  }
}
