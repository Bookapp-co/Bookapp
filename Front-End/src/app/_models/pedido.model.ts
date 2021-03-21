
import { Platillo } from './platillo.model';
import { Historial } from './historial.model';
import { Negocio } from './negocio.model';
import { Usuario } from './usuario.model';
import { Forma_Pago } from './forma_pago.model';
import { Servicio } from './servicio.model';
import { Categoria } from './categoria.model';

export class Pedido {

  public _id : String;
  public fecha_alta: Object;
  public origen: Object;
  public origen_direccion: String;
  public origen_latitude: number;
  public origen_longitude: number;
  public destino: Object;
  public destino_direccion: String;
  public destino_latitude: number;
  public destino_longitude: number;
  public descripcion: String;
  public referencia: String;
  public comentarios: String;
  public foto: String;
  public telefono: String;
  public tipo_servicio: number;
  public motofast: Object;
  public negocio: Negocio;
  public usuario: Usuario;
  public usuario_id: String;
  public forma_pago: Forma_Pago;
  public forma_pago_id: String;
  public categoria_id: String;
  public tarjeta: Object;
  public tarjeta_id: String;
  public negocio_id: String;
  public motofast_id: String;
  public tiempo_texto: String;
  public distancia_diferencia: number;
  public minimo: number;
  public maximo: number;
  public subtotal: number;
  public costo_envio: number;
  public platillos : Array<Platillo>;
  public historial : Array<Historial>;
  public total: number;
  public status: number;

  public fecha_asignar_motofast: Date;
  public fecha_recogi_productos: Date;
  public fecha_entregue_productos: Date;
  public fecha_platillos_listos: Date;
  public fecha_pedido_listo: Date;
  public fecha_cancelacion_vendedor: Date;

  public repartidor_direccion: String;
  public repartidor_latitude: number;
  public repartidor_longitude: number;

  public programar  : boolean;
  public fecha_pedido: Date;
  public hora_pedido: String;

  public confirmacion_cliente  : boolean;
  public confirmacion_admins  : boolean;

  public estimado_pago_cliente: number;

  public pideloquequieras  : boolean;
  public solicitar_confirmacion_cliente  : boolean;
  public confirmacion_total  : boolean;

  public calificado_cliente: Boolean;
  public calificado_negocio: Boolean;
  public calificacion_cliente: number;
  public calificacion_negocio: number;
  public calificacion_comentarios_cliente: String;
  public calificacion_comentarios_negocio: String;

  public comision_bancaria: number;

  public fecha_cita: Date;
  public inicio_cita: Date;
  public fin_cita: Date;

  public inicio_cita_string: string;
  public fin_cita_string: string;

  public dia: number;
  public dia_hoy: number;
  public mes: number;
  public anio: number;

  public fecha_confirmacion: Date;
  public fecha_completado: Date;
  public fecha_no_presento: Date;
  public fecha_cancelacion: Date;

  public servicio: Categoria;
  public servicio_id: String;

  public promocion : boolean;
  public detalle_promocion  : String;
  public aplica_porcentaje : boolean;
  public porcentaje_descuento  : number;

  public anticipo : boolean;
  public anticipo_cantidad : number;

  public decoracion : number;
  public decoracion_cantidad : number;

  public pago_forzado : boolean;
  public pagar_totalidad : boolean;
  public pagar_ahora : number;

  public agregar_decoracion : boolean;

  public numero_de_personas: number;

  constructor(
      _id : string = '',
      fecha_alta : string = '',
      origen = {
        "direccion" : '',
        "latitude" :  '',
        "longitude" : ''
      },
      origen_direccion: string = '',
      origen_latitude: number = 0,
      origen_longitude: number = 0,
      destino = {
        "direccion" : '',
        "latitude" :  '',
        "longitude" : ''
      },
      destino_direccion: string = '',
      destino_latitude: number = 0,
      destino_longitude: number = 0,
      descripcion: string = '',
      referencia: string = '',
      comentarios: string = '',
      foto: string = '',
      telefono: string = '',
      tipo_servicio: number = 0,
      motofast: string = '',
      negocio: Negocio = new Negocio(),
      usuario: Usuario = new Usuario(),
      usuario_id: string = '',
      forma_pago: Forma_Pago = new Forma_Pago(),
      forma_pago_id: string = '',
      categoria_id: string = '',
      tarjeta: string = '',
      tarjeta_id: string = '',
      negocio_id: string = '',
      motofast_id: string = '',
      tiempo_texto: string = '',
      distancia_diferencia: number = 0,
      minimo: number = 0,
      maximo: number = 0,
      subtotal: number = 0,
      costo_envio: number = 0,
      total: number = 0,
      status: number = 1,
      platillos : Platillo[] = [],
      historial : Historial[] = [],

      fecha_asignar_motofast: Date = new Date(),
      fecha_recogi_productos: Date = new Date(),
      fecha_entregue_productos: Date = new Date(),
      fecha_platillos_listos: Date = new Date(),
      fecha_pedido_listo: Date = new Date(),
      fecha_cancelacion_vendedor: Date = new Date(),
      repartidor_direccion: string = '',
      repartidor_latitude: number = 0,
      repartidor_longitude: number = 0,

      programar  : boolean = false,
      fecha_pedido: Date = new Date(),
      hora_pedido: string = '',

      confirmacion_cliente  : boolean = false,
      confirmacion_admins  : boolean = false,

      estimado_pago_cliente: number = 0,

      pideloquequieras  : boolean = false,
      solicitar_confirmacion_cliente  : boolean = false,
      confirmacion_total    : boolean = false,

      calificado_cliente    : boolean = false,
      calificado_negocio    : boolean = false,
      calificacion_cliente  : number = 0,
      calificacion_negocio  : number = 0,
      calificacion_comentarios_cliente: string = '',
      calificacion_comentarios_negocio: string = '',

      comision_bancaria: number = 0,

      fecha_cita: Date = new Date(),
      inicio_cita: Date = new Date(),
      fin_cita: Date = new Date(),

      inicio_cita_string: string = '',
      fin_cita_string: string = '',

      dia: number = 0,
      dia_hoy: number = 0,
      mes: number = 0,
      anio: number = 0,

      fecha_confirmacion: Date = new Date(),
      fecha_completado: Date = new Date(),
      fecha_no_presento: Date = new Date(),
      fecha_cancelacion: Date = new Date(),

      servicio: Categoria = new Categoria(),
      servicio_id: string = '',

      promocion : boolean = false,
      detalle_promocion: string = '',
      aplica_porcentaje : boolean = false,
      porcentaje_descuento  : number = 0,

      anticipo : boolean = false,
      anticipo_cantidad  : number = 0,

      decoracion  : number = 2,
      decoracion_cantidad  : number = 0,

      pago_forzado : boolean = false,
      pagar_totalidad : boolean = false,
      pagar_ahora  : number = 0,

      agregar_decoracion : boolean = false,

      numero_de_personas: number = 0,

  ) {

    this._id                = _id;
    this.fecha_alta         = fecha_alta;
    this.origen             = origen;
    this.origen_direccion   = origen_direccion;
    this.origen_latitude    = origen_latitude;
    this.origen_longitude   = origen_longitude;
    this.destino            = destino;
    this.destino_direccion  = destino_direccion;
    this.destino_latitude   = destino_latitude;
    this.destino_longitude  = destino_longitude;
    this.descripcion        = descripcion;
    this.referencia         = referencia;
    this.comentarios        = comentarios;
    this.foto               = foto;
    this.telefono           = telefono;
    this.tipo_servicio      = tipo_servicio;
    this.motofast           = motofast;
    this.negocio            = negocio;
    this.usuario            = usuario;
    this.usuario_id         = usuario_id;
    this.forma_pago         = forma_pago;
    this.forma_pago_id      = forma_pago_id;
    this.categoria_id       = categoria_id;
    this.tarjeta            = tarjeta;
    this.tarjeta_id         = tarjeta_id;
    this.negocio_id         = negocio_id;
    this.motofast_id        = motofast_id;
    this.tiempo_texto       = tiempo_texto;
    this.distancia_diferencia = distancia_diferencia;
    this.minimo             = minimo;
    this.maximo             = maximo;
    this.subtotal           = subtotal;
    this.total              = total;
    this.costo_envio        = costo_envio;
    this.platillos          = platillos;
    this.historial          = historial;
    this.fecha_asignar_motofast = fecha_asignar_motofast;
    this.fecha_recogi_productos = fecha_recogi_productos;
    this.fecha_entregue_productos = fecha_entregue_productos;
    this.fecha_platillos_listos = fecha_platillos_listos;
    this.fecha_pedido_listo = fecha_pedido_listo;
    this.fecha_cancelacion_vendedor = fecha_cancelacion_vendedor;
    this.repartidor_direccion     = repartidor_direccion;
    this.repartidor_latitude      = repartidor_latitude;
    this.repartidor_longitude     = repartidor_longitude;

    this.programar     = programar;
    this.fecha_pedido  = fecha_pedido;
    this.hora_pedido   = hora_pedido;

    this.confirmacion_cliente   = confirmacion_cliente;
    this.confirmacion_admins   = confirmacion_admins;

    this.estimado_pago_cliente   = estimado_pago_cliente;

    this.pideloquequieras   = pideloquequieras;
    this.solicitar_confirmacion_cliente   = solicitar_confirmacion_cliente;
    this.confirmacion_total   = confirmacion_total;

    this.calificado_cliente   = calificado_cliente;
    this.calificado_negocio   = calificado_negocio;
    this.calificacion_cliente = calificacion_cliente;
    this.calificacion_negocio = calificacion_negocio;
    this.calificacion_comentarios_cliente = calificacion_comentarios_cliente;
    this.calificacion_comentarios_negocio = calificacion_comentarios_negocio;

    this.comision_bancaria = comision_bancaria;

    this.fecha_cita     = fecha_cita;
    this.inicio_cita    = inicio_cita;
    this.fin_cita       = fin_cita;

    this.inicio_cita_string    = inicio_cita_string;
    this.fin_cita_string       = fin_cita_string;

    this.dia            = dia;
    this.dia_hoy        = dia_hoy;
    this.mes            = mes;
    this.anio           = anio;

    this.fecha_confirmacion = fecha_confirmacion;
    this.fecha_completado = fecha_completado;
    this.fecha_no_presento = fecha_no_presento;
    this.fecha_cancelacion = fecha_cancelacion;

    this.servicio     = servicio;
    this.servicio_id  = servicio_id;

    this.promocion         = promocion;
    this.detalle_promocion = detalle_promocion;
    this.aplica_porcentaje = aplica_porcentaje;
    this.porcentaje_descuento = porcentaje_descuento;

    this.anticipo          = anticipo;
    this.anticipo_cantidad = anticipo_cantidad;

    this.decoracion          = decoracion;
    this.decoracion_cantidad = decoracion_cantidad;

    this.pago_forzado = pago_forzado;
    this.pagar_totalidad = pagar_totalidad;
    this.pagar_ahora  = pagar_ahora;

    this.agregar_decoracion = agregar_decoracion;

    this.numero_de_personas = numero_de_personas;

  }
}
