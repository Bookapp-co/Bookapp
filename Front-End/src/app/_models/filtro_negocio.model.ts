
import { Categoria } from './categoria.model';

export class Filtro_Negocio {

  public direccion: String;
  public latitude: number;
  public longitude: number;
  public categoria: Categoria;
  public categoria_id: String;
  public ubicacion : boolean;

  constructor(

    direccion: string = '',
    latitude: number = 0,
    longitude: number = 0,
    categoria: Categoria = new Categoria(),
    categoria_id: string = '',
    ubicacion  : boolean = false,

  ){

    this.direccion    = direccion;
    this.latitude     = latitude;
    this.longitude    = longitude;
    this.categoria    = categoria;
    this.categoria_id = categoria_id;
    this.ubicacion = ubicacion;

  }
}
