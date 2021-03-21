

import { Platillo } from './platillo.model';

export class SubCategoria {

  public _id : String;
  public nombre: String;
  public negocio_id: String;
  public categoria: Object;
  public categoria_id: String;
  public foto: String;
  public status: number;
  public expand : boolean;
  public platillos : Platillo[];

  constructor(
    _id : string = '',
    nombre: string = '',
    negocio_id: string = '',
    categoria: string = '',
    categoria_id: string = '',
    foto: string = '',
    status: number = 1,
    expand : boolean = false,
    platillos: Platillo[] = [],
  ){

    this._id          = _id;
    this.nombre       = nombre;
    this.negocio_id   = negocio_id;
    this.categoria    = categoria;
    this.categoria_id = categoria_id;
    this.foto         = foto;
    this.status       = status;
    this.expand       = expand;
    this.platillos    = platillos;

  }
}
