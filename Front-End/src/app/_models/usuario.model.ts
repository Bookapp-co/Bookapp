

import { Tipo_Usuario } from './tipo_usuario.model';
import { Negocio } from './negocio.model';

export class Usuario {

  public _id : String;
  public nombre: String;
  public nombre_negocio: String;
  public foto: String;
  public telefono: String;
  public tipo_usuario: Tipo_Usuario;
  public tipo_usuario_id: String;
  public negocio: Object;
  public negocio_id: String;
  public sucursal: Object;
  public sucursal_id: String;
  public fecha_alta: String;
  public correo: String;
  public contrasena: String;
  public direccion_id: String;
  public customer_id: String;
  public status: number;
  public comision: number;

  public terminos : Boolean;
  public aviso : Boolean;

  public contrasena_verifica: String;
  public codigo_seguridad: String;

  public direccion: String;
  public latitude: number;
  public longitude: number;

  constructor(
      _id : string = '',
      nombre: string = '',
      nombre_negocio: string = '',
      foto: string = '',
      telefono: string = '',
      tipo_usuario: Tipo_Usuario = new Tipo_Usuario(),
      tipo_usuario_id: string = '',
      negocio: string = '',
      negocio_id: string = '',
      sucursal: string = '',
      sucursal_id: string = '',
      fecha_alta: string = '',
      correo: string = '',
      contrasena: string = '',
      direccion_id: string = '',
      customer_id: string = '',
      status: number = 1,
      comision: number = 0,

      terminos : boolean = false,
      aviso : boolean = false,

      contrasena_verifica: string = '',
      codigo_seguridad: string = '',
      direccion: string = '',
      latitude: number = 0,
      longitude: number = 0,
  ) {

    this._id              = _id;
    this.nombre           = nombre;
    this.nombre_negocio   = nombre_negocio;
    this.foto             = foto;
    this.telefono         = telefono;
    this.tipo_usuario     = tipo_usuario;
    this.negocio          = negocio;
    this.negocio_id       = negocio_id;
    this.sucursal         = sucursal;
    this.sucursal_id      = sucursal_id;
    this.tipo_usuario_id  = tipo_usuario_id;
    this.fecha_alta       = fecha_alta;
    this.correo           = correo;
    this.contrasena       = contrasena;
    this.direccion_id     = direccion_id;
    this.customer_id      = customer_id;
    this.status           = status;
    this.comision         = comision;

    this.terminos = terminos;
    this.aviso = aviso;

    this.contrasena_verifica = contrasena_verifica;
    this.codigo_seguridad = codigo_seguridad;

    this.direccion = direccion;
    this.latitude = latitude;
    this.longitude = longitude;

  }
}
