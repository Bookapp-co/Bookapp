

import { Categoria } from './categoria.model';
import { Grupo_Ingrediente } from './grupo_ingrediente.model';

export class Platillo {

  public _id : String;
  public nombre: String;

  public marca: String;
  public presentacion: String;
  public capacidad: String;
  public unidad: String;


  public descripcion: String;
  public foto: String;
  public costo: number;
  public grupo_ingrediente : Grupo_Ingrediente[];
  public categoria: Categoria;
  public categoria_id: String;
  public negocio: Object;
  public negocio_id: String;
  public fecha_alta: Date;
  public cantidad: number;
  public total: number;
  public status: number;
  public disponible: boolean;

  public promocion  : boolean;
  public promocion_total: number;

  constructor(
      _id : string = '',
      nombre: string = '',
      foto: string = '',
      descripcion: string = '',
      costo: number = 0,
      grupo_ingrediente: Grupo_Ingrediente[] = [],
      categoria: Categoria = new Categoria(),
      categoria_id: string = '',
      negocio: string = '',
      negocio_id: string = '',
      cantidad: number = 0,
      total: number = 0,
      status: number = 1,

      promocion_total: number = 0,
  ) {

    this._id                = _id;
    this.nombre             = nombre;
    this.foto               = foto;
    this.descripcion        = descripcion;
    this.costo              = costo;
    this.grupo_ingrediente  = grupo_ingrediente;
    this.categoria          = categoria;
    this.categoria_id       = categoria_id;
    this.fecha_alta         = new Date();
    this.status             = status;
    this.cantidad           = cantidad;
    this.total              = total;
    this.disponible         = true;
    this.promocion          = false;
    this.promocion_total    = promocion_total;

  }
}
