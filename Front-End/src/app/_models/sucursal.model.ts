
import { Categoria } from './categoria.model';
import { Usuario } from './usuario.model';

export class Sucursal {

  public _id : String;
  public rfc: String;
  public nombre: String;
  public descripcion: String;
  public telefono: String;
  public direccion: String;
  public comision: number;
  public latitude: number;
  public longitude: number;
  public usuario: Usuario;
  public location: Object;
  public usuario_id: String;
  public platillos: Object;
  public categorias : Categoria[];
  public categoria: Categoria;
  public categoria_id: String;
  public banner_image: String;
  public foto: String;
  public status: number;
  public lat: number;
  public lng: number;
  public draggable: boolean;
  public entrega_en_tienda: boolean;
  public delivery: boolean;
  public kms_delivery: number;
  public distance: number;

  public fecha_nacimiento: String;
  public id_personal: String;
  public id_foto_anverso: String;
  public id_foto_inverso: String;
  public id_foto_anverso_url: String;
  public id_foto_inverso_url: String;
  public id_foto_ruc: String;
  public id_foto_ruc_url: String;
  public estado: String;
  public sitio_web: String;
  public clabe_bancaria: String;

  public pago_efectivo : boolean;
  public pago_tarjeta  : boolean;

  public costo_cancelacion: number;
  public impuesto: number;
  public costo_envio: number;

  public tipo_delivery: number;
  public tipo_costo_envio: number;
  public asignacion_delivery: number;

  public titular_cuenta: String;
  public numero_cuenta: String;
  public tipo_cuenta_bancaria: number;
  public banco: String;
  public cedula: String;

  public perfil_completo  : boolean;
  public sistema_de_puntos  : boolean;

  public correo: String;
  public contrasena: String;
  public costo_minimo: number;
  public costo_delivery: number;

  public lunes_trabaja : Boolean;
  public martes_trabaja : Boolean;
  public miercoles_trabaja : Boolean;
  public jueves_trabaja : Boolean;
  public viernes_trabaja : Boolean;
  public sabado_trabaja : Boolean;
  public domingo_trabaja : Boolean;

  public lunes_inicia : String;
  public martes_inicia : String;
  public miercoles_inicia : String;
  public jueves_inicia : String;
  public viernes_inicia : String;
  public sabado_inicia : String;
  public domingo_inicia : String;

  public lunes_termina : String;
  public martes_termina : String;
  public miercoles_termina : String;
  public jueves_termina : String;
  public viernes_termina : String;
  public sabado_termina : String;
  public domingo_termina : String;

  public duracion_cita: number;
  public numero_de_mesas: number;

  constructor(

    _id : string = '',
    rfc: string = '',
    nombre: string = '',
    descripcion: string = '',
    telefono: string = '',
    direccion: string = '',
    comision: number = 5,
    latitude: number = 0,
    longitude: number = 0,
    usuario: Usuario = new Usuario(),
    location: string = '',
    usuario_id: string = '',
    platillos: string = '',
    categorias: Categoria[] = [],
    categoria: Categoria = new Categoria(),
    categoria_id: string = '',
    banner_image: string = '',
    foto: string = '',
    status: number = 1,
    lat: number = 0,
    lng: number = 0,
    draggable: boolean = false,
    entrega_en_tienda: boolean = false,
    delivery: boolean = false,
    kms_delivery: number = 0,
    distance: number = 0,

    fecha_nacimiento: string = '',
    id_personal: string = '',
    id_foto_anverso: string = '',
    id_foto_inverso: string = '',
    id_foto_anverso_url: string = '',
    id_foto_inverso_url: string = '',
    id_foto_ruc: string = '',
    id_foto_ruc_url: string = '',
    estado: string = '',
    sitio_web: string = '',
    clabe_bancaria: string = '',

    pago_efectivo : boolean = false,
    pago_tarjeta  : boolean = false,

    costo_cancelacion: number = 0,
    impuesto: number = 0,
    costo_envio: number = 0,

    tipo_delivery: number = 1,
    tipo_costo_envio: number = 1,
    asignacion_delivery: number = 1,

    titular_cuenta: string = '',
    numero_cuenta: string = '',
    tipo_cuenta_bancaria: number = 1,
    banco: string = '',
    cedula: string = '',

    perfil_completo: boolean = false,
    sistema_de_puntos: boolean = false,

    correo: string = '',
    contrasena: string = '',
    costo_minimo: number = 1,
    costo_delivery: number = 1,


    lunes_trabaja : boolean = false,
    martes_trabaja : boolean = false,
    miercoles_trabaja : boolean = false,
    jueves_trabaja : boolean = false,
    viernes_trabaja : boolean = false,
    sabado_trabaja : boolean = false,
    domingo_trabaja : boolean = false,

    lunes_inicia: string = '',
    martes_inicia: string = '',
    miercoles_inicia: string = '',
    jueves_inicia: string = '',
    viernes_inicia: string = '',
    sabado_inicia: string = '',
    domingo_inicia: string = '',

    lunes_termina: string = '',
    martes_termina: string = '',
    miercoles_termina: string = '',
    jueves_termina: string = '',
    viernes_termina: string = '',
    sabado_termina: string = '',
    domingo_termina: string = '',

    duracion_cita: number = 0,
    numero_de_mesas: number = 0,

  ){

    this._id          = _id;
    this.rfc          = rfc;
    this.nombre       = nombre;
    this.descripcion  = descripcion;
    this.telefono     = telefono;
    this.direccion    = direccion;
    this.comision     = comision;
    this.latitude     = latitude;
    this.longitude    = longitude;
    this.usuario      = usuario;
    this.location     = location;
    this.usuario_id   = usuario_id;
    this.platillos    = platillos;
    this.categorias   = categorias;
    this.categoria    = categoria;
    this.categoria_id = categoria_id;
    this.banner_image = banner_image;
    this.foto         = foto;
    this.status       = status;
    this.lat          = lat;
    this.lng          = lng;
    this.draggable    = draggable;
    this.entrega_en_tienda     = entrega_en_tienda;
    this.delivery     = delivery;
    this.kms_delivery = kms_delivery;
    this.distance     = distance;

    this.fecha_nacimiento        = fecha_nacimiento;
    this.id_personal             = id_personal;
    this.id_foto_anverso         = id_foto_anverso;
    this.id_foto_inverso         = id_foto_inverso;
    this.id_foto_anverso_url     = id_foto_anverso_url;
    this.id_foto_inverso_url     = id_foto_inverso_url;
    this.id_foto_ruc             = id_foto_ruc;
    this.id_foto_ruc_url         = id_foto_ruc_url;
    this.estado                  = estado;
    this.sitio_web               = sitio_web;
    this.clabe_bancaria          = clabe_bancaria;

    this.pago_efectivo           = pago_efectivo;
    this.pago_tarjeta            = pago_tarjeta;

    this.costo_cancelacion       = costo_cancelacion;
    this.impuesto                = impuesto;
    this.costo_envio             = costo_envio;

    this.tipo_delivery           = tipo_delivery;
    this.tipo_costo_envio        = tipo_costo_envio;
    this.asignacion_delivery     = asignacion_delivery;

    this.titular_cuenta          = titular_cuenta;
    this.numero_cuenta           = numero_cuenta;
    this.tipo_cuenta_bancaria    = tipo_cuenta_bancaria;
    this.banco                   = banco;
    this.cedula                  = cedula;

    this.perfil_completo         = perfil_completo;
    this.sistema_de_puntos       = sistema_de_puntos;

    this.correo                  = correo;
    this.contrasena              = contrasena;
    this.costo_minimo            = costo_minimo;
    this.costo_delivery          = costo_delivery;

    this.lunes_trabaja = lunes_trabaja;
    this.martes_trabaja = martes_trabaja;
    this.miercoles_trabaja = miercoles_trabaja;
    this.jueves_trabaja = jueves_trabaja;
    this.viernes_trabaja = viernes_trabaja;
    this.sabado_trabaja = sabado_trabaja;
    this.domingo_trabaja = domingo_trabaja;

    this.lunes_inicia = lunes_inicia;
    this.martes_inicia = martes_inicia;
    this.miercoles_inicia = miercoles_inicia;
    this.jueves_inicia = jueves_inicia;
    this.viernes_inicia = viernes_inicia;
    this.sabado_inicia = sabado_inicia;
    this.domingo_inicia = domingo_inicia;

    this.lunes_termina = lunes_termina;
    this.martes_termina = martes_termina;
    this.miercoles_termina = miercoles_termina;
    this.jueves_termina = jueves_termina;
    this.viernes_termina = viernes_termina;
    this.sabado_termina = sabado_termina;
    this.domingo_termina = domingo_termina;

    this.duracion_cita    = duracion_cita;
    this.duracion_cita    = duracion_cita;

  }
}
