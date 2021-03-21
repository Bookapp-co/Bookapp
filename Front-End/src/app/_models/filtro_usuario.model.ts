
import { Categoria } from './categoria.model';

export class Filtro_Usuario {

  public direccion: String;
  public latitude: number;
  public longitude: number;
  public categoria: Categoria;
  public categoria_id: String;
  public tipo_usuario_id: String;
  public ubicacion : boolean;
  public filtrar_por_fechas : boolean;

  constructor(

    direccion: string = '',
    latitude: number = 0,
    longitude: number = 0,
    categoria: Categoria = new Categoria(),
    categoria_id: string = '',
    tipo_usuario_id: string = '',
    ubicacion  : boolean = false,
    filtrar_por_fechas  : boolean = false,

  ){

    this.direccion    = direccion;
    this.latitude     = latitude;
    this.longitude    = longitude;
    this.categoria    = categoria;
    this.categoria_id = categoria_id;
    this.tipo_usuario_id = tipo_usuario_id;
    this.ubicacion = ubicacion;
    this.filtrar_por_fechas = filtrar_por_fechas;

  }
}
