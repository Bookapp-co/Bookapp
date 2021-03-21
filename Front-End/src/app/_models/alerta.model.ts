
export class Alerta {

  public _id : String;
  public titulo: String;
  public mensaje: String;
  public direccion: String;
  public negocio: Object;
  public fecha_alta: Date;
  public alcance: number;
  public ubicacion_toggle: number;
  public administradores: boolean;
  public clientes: boolean;
  public sucursales: boolean;
  public especificos: boolean;
  public latitude: number;
  public longitude: number;
  public status: number;

  constructor(
      _id : string = '',
      direccion: string = '',
      negocio: string = '',
      alcance: number = 1,
      ubicacion_toggle: number = 1,
      administradores: boolean = false,
      clientes: boolean = false,
      sucursales: boolean = false,
      especificos: boolean = false,
      latitude: number = 0,
      longitude: number = 0,
      status: number = 1
  ) {

    this._id                = _id;
    this.direccion          = direccion;
    this.negocio            = negocio;
    this.fecha_alta         = new Date();
    this.alcance            = alcance;
    this.ubicacion_toggle   = ubicacion_toggle;
    this.administradores    = administradores;
    this.clientes           = clientes;
    this.sucursales         = sucursales;
    this.especificos        = especificos;
    this.latitude           = latitude;
    this.longitude          = longitude;
    this.status             = status;

  }
}
