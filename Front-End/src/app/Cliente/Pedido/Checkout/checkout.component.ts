import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { NgbModal, ModalDismissReasons, NgbTabset, NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import {animate, query, style, transition, trigger} from '@angular/animations';
import { Negocio } from '../../../_models/negocio.model';
import { Tarjeta } from '../../../_models/tarjeta.model';
import { Pedido } from '../../../_models/pedido.model';
import { Imagen } from '../../../_models/imagen.model';
import { Usuario } from '../../../_models/usuario.model';
import { Ubicacion } from '../../../_models/ubicacion.model';
import { Configuracion } from '../../../_models/configuracion.model';
import { MapsAPILoader } from '@agm/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import {FormControl} from '@angular/forms';
import {TooltipPosition} from '@angular/material/tooltip';

declare let google: any;

@Component({
  selector: 'cliente-checkout',
  templateUrl: './checkout.component.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class CheckoutComponent implements OnInit {

  heading = 'Checkout de pedido';
  subheading = "Por favor, confirma tus platillos";
  icon = 'pe-7s-folder icon-gradient bg-tempting-azure';

  mainObject$ = new Pedido();
  configuracion$ = new Configuracion();
  tarjetaObject$ = new Tarjeta();
  cliente$ = new Usuario();
  foto$ = new Imagen();
  categorias$ : any;
  index$ : any;
  currentUser$ : any;
  negocioObj$ : any;
  negocioOtrosParametros$ : any;
  promocionEfectivo$ = false;
  modalMaxHeight$:any;
  sucursalesArray$: any;
  tiposPago$: any;
  tarjetas$ = [];
  distanciasArray$ = [];
  peluquerosArray$ = [];
  platilloSeleccionado$: any;
  modalReference: any;
  paso_actual : any;
  zoom : any;
  mapPoints : any;
  sucursalSeleccionada$ : any;
  mensaje$ : any;
  isClicked = false;
  sePuedeModificarMedioDePago$ = true;

  slick2$ : any;

  slideGaleria = {
    className: '',
    centerMode: false,
    infinite: true,
    centerPadding: '0px',
    slidesToShow: 1,
    dots: false,
    arrows: true,
    initialSlide : 0,
    swipeToSlide: true
  };


  servicios$ = [];
  horarios$  = [];

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  @ViewChild('mOpciones') mOpciones: TemplateRef<any>;
  @ViewChild('mMensaje') mMensaje: TemplateRef<any>;
  @ViewChild('mTipoPago') mTipoPago: TemplateRef<any>;
  @ViewChild('mTipoServicio') mTipoServicio: TemplateRef<any>;
  @ViewChild('mTarjetas') mTarjetas: TemplateRef<any>;
  @ViewChild('mNuevaTarjeta') mNuevaTarjeta: TemplateRef<any>;
  @ViewChild('mServicios') mServicios: TemplateRef<any>;
  @ViewChild('mHorarios') mHorarios: TemplateRef<any>;
  @ViewChild('mProfesionales') mProfesionales: TemplateRef<any>;
  @ViewChild('mVerFoto') mVerFoto: TemplateRef<any>;
  @ViewChild('mCapturarCliente') mCapturarCliente: TemplateRef<any>;
  @ViewChild('mConfirmacionCitaCliente') mConfirmacionCitaCliente: TemplateRef<any>;
  @ViewChild('mConfirmacionCitaNegocio') mConfirmacionCitaNegocio: TemplateRef<any>;


  constructor( private sanitizer: DomSanitizer, private ngZone: NgZone, private mapsAPILoader: MapsAPILoader, private router: Router, private activatedRoute: ActivatedRoute, private dataService : DataService , private authenticationService: AuthenticationService, private modalService: NgbModal ){
    authenticationService.getUbicacion.subscribe(data => this.recalcularDistancia(data));
  }

  verFoto(registro_t){
    this.foto$ = registro_t;
    this.modalReference = this.modalService.open(this.mVerFoto, { windowClass: 'modal-holder' } );
  }

  slickInit2(e){
    this.slick2$ = e.slick;
  }

  cambioFecha( fecha_t ){

  }

  getServicios(){
    this.dataService.useService( "get_categorias_negocio" , { data : this.negocioObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.servicios$ = data.data;
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  seleccionarServicio(){
    this.modalReference = this.modalService.open(this.mServicios, { windowClass: 'modal-holder' } );
  }

  returnHorario(result){
    this.mainObject$.inicio_cita        = result.start;
    this.mainObject$.fin_cita           = result.end;
    this.mainObject$.inicio_cita_string = new Date( new Date(result.start).getTime() - ( new Date(result.start).getTimezoneOffset() * 60000)).toJSON();
    this.mainObject$.fin_cita_string    = new Date( new Date(result.end).getTime() - ( new Date(result.end).getTimezoneOffset() * 60000)).toJSON();
    this.modalReference.close();
  }

  triggerTotalReserva(evt){
    this.mainObject$.total = this.mainObject$.servicio.costo;
    if(this.mainObject$.servicio.promocion){

      this.mainObject$.promocion = this.mainObject$.servicio.promocion;
      this.mainObject$.porcentaje_descuento = this.mainObject$.servicio.porcentaje_descuento;

      this.mainObject$.total = this.mainObject$.total - (this.mainObject$.total*this.mainObject$.servicio.porcentaje_descuento)/100;
    }
    if( this.mainObject$.agregar_decoracion ){
      this.mainObject$.total = this.mainObject$.total + (this.mainObject$.decoracion_cantidad);
    }
    if( !this.mainObject$.total ){
      this.mainObject$.pagar_totalidad = false;
    }
    if( !this.mainObject$.pagar_totalidad ){
      if( this.mainObject$.anticipo && (!(this.negocioObj$.categoria_id === "5ee4110b31a9c57966bf37c5")) ){
        this.mainObject$.pagar_ahora      = this.mainObject$.anticipo_cantidad;
        this.mainObject$.pago_forzado       = true;
        this.sePuedeModificarMedioDePago$   = false;
        for( var i = 0; i<this.tiposPago$.length; i++ ){
          if( this.tiposPago$[i]._id === "5e0a904ece07baeb91675dbe" ){
            this.mainObject$.forma_pago     = this.tiposPago$[i];
            this.mainObject$.forma_pago_id  = this.tiposPago$[i]._id;
          }
        }
      }else{
        if( this.negocioObj$.categoria_id === "5ee4110b31a9c57966bf37c5" && this.mainObject$.agregar_decoracion ){
          this.mainObject$.pagar_ahora      = this.mainObject$.anticipo_cantidad;
          this.mainObject$.pago_forzado       = true;
          this.sePuedeModificarMedioDePago$   = false;
          for( var i = 0; i<this.tiposPago$.length; i++ ){
            if( this.tiposPago$[i]._id === "5e0a904ece07baeb91675dbe" ){
              this.mainObject$.forma_pago     = this.tiposPago$[i];
              this.mainObject$.forma_pago_id  = this.tiposPago$[i]._id;
            }
          }
        }else{
          this.mainObject$.pagar_ahora      = 0;
          this.mainObject$.pago_forzado       = false;
          this.sePuedeModificarMedioDePago$   = true;
        }
      }
    }else{
      this.mainObject$.pagar_ahora        = this.mainObject$.total;
      this.mainObject$.pago_forzado       = true;
      this.sePuedeModificarMedioDePago$   = false;
      for( var i = 0; i<this.tiposPago$.length; i++ ){
        if( this.tiposPago$[i]._id === "5e0a904ece07baeb91675dbe" ){
          this.mainObject$.forma_pago     = this.tiposPago$[i];
          this.mainObject$.forma_pago_id  = this.tiposPago$[i]._id;
        }
      }
    }
  }

  returnServicio(tipo_t){

    console.log(tipo_t);

    delete this.mainObject$.promocion;
    delete this.mainObject$.porcentaje_descuento;
    delete this.mainObject$.anticipo;
    delete this.mainObject$.anticipo_cantidad;
    delete this.mainObject$.decoracion;
    delete this.mainObject$.decoracion_cantidad;

    for( var i = 0; i<this.tiposPago$.length; i++ ){
      if( this.tiposPago$[i]._id === "5e0a9048ce07baeb91675dbd" ){
        this.mainObject$.forma_pago     = this.tiposPago$[i];
        this.mainObject$.forma_pago_id  = this.tiposPago$[i]._id;
      }
    }

    this.mainObject$.servicio             = tipo_t;
    this.mainObject$.servicio_id          = tipo_t._id;

    this.mainObject$.decoracion           = tipo_t.decoracion;
    this.mainObject$.decoracion_cantidad  = tipo_t.decoracion_cantidad;

    this.mainObject$.total = 0;
    if(tipo_t.costo){
      this.mainObject$.total = parseFloat(tipo_t.costo);
    }
    if(tipo_t.promocion){

      this.mainObject$.promocion = tipo_t.promocion;
      this.mainObject$.detalle_promocion = tipo_t.detalle_promocion;
      this.mainObject$.aplica_porcentaje = tipo_t.aplica_porcentaje;
      this.mainObject$.porcentaje_descuento = tipo_t.porcentaje_descuento;

      this.mainObject$.total = this.mainObject$.total - (this.mainObject$.total*tipo_t.porcentaje_descuento)/100;
    }
    if( tipo_t.anticipo ){

      this.mainObject$.anticipo = tipo_t.anticipo;
      this.mainObject$.anticipo_cantidad = tipo_t.anticipo_cantidad;

      this.mainObject$.pago_forzado = true;
      this.mainObject$.pagar_ahora  = this.mainObject$.anticipo_cantidad;

      this.sePuedeModificarMedioDePago$ = false;
      for( var i = 0; i<this.tiposPago$.length; i++ ){
        if( this.tiposPago$[i]._id === "5e0a904ece07baeb91675dbe" ){
          this.mainObject$.forma_pago     = this.tiposPago$[i];
          this.mainObject$.forma_pago_id  = this.tiposPago$[i]._id;
        }
      }

    }else{
      this.mainObject$.pago_forzado = false;
      this.mainObject$.pagar_ahora  = 0;
      this.sePuedeModificarMedioDePago$ = true;
    }

    if( this.negocioObj$.categoria_id === '5ee410fe31a9c57966bf37c4' ){
      this.cambioNumeroPersonas();
    }
    if(this.modalReference){
      this.modalReference.close();
    }
  }

  getHorario(){
    this.mainObject$.fecha_alta = new Date();
    this.mainObject$.dia  = this.mainObject$.fecha_cita.getDay();
    this.mainObject$.mes  = this.mainObject$.fecha_cita.getMonth();
    this.mainObject$.anio = this.mainObject$.fecha_cita.getFullYear();
    this.mainObject$.dia_hoy = new Date().getDate();
    console.log(this.mainObject$ );
    console.log(this.negocioObj$ );
    this.dataService.useService( "get_horarios_disponibles" , { data : this.mainObject$, negocio : this.negocioObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.horarios$ = data.fechas;
          for( var i = 0; i<this.horarios$.length; i++ ){
            var new_format = this.horarios$[i].start.replace('Z', '');
            this.horarios$[i].start = new Date( new_format );
            new_format = this.horarios$[i].end.replace('Z', '');
            this.horarios$[i].end = new Date( new_format );
          }
          this.modalReference = this.modalService.open(this.mHorarios, { windowClass: 'modal-holder' } );
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  regresar(){
    if( this.currentUser$.tipo_usuario_id === "5c40513258209844a83c8629" ){
      //Cliente
      this.router.navigateByUrl('/cliente/seleccion-negocio', {  });
    }else{
      this.authenticationService.redireccionarUsuario(this.currentUser$);
    }
  }

  abrirUbicacion(){
    this.router.navigate(['pages/ubicaciones'], { state : { regresar : '/pedidos/checkout' } });
  }

  recalcularDistancia(data){
    var R = 6371; // km
    var dLat = this.toRad(this.negocioObj$.latitude-this.currentUser$.latitude);
    var dLon = this.toRad(this.negocioObj$.longitude-this.currentUser$.longitude);
    var lat1 = this.toRad(this.currentUser$.latitude);
    var lat2 = this.toRad(this.negocioObj$.latitude);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(this.currentUser$.latitude) * Math.cos(this.negocioObj$.latitude);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    console.log("distance", d);
    this.negocioObj$.distance = d;
    if( !this.negocioObj$.delivery || (this.negocioObj$.kms_delivery <= (this.negocioObj$.distance)) ){
      this.mainObject$.tipo_servicio = 1;
    }
    return d;
  }

  toRad(Value){
      return Value * Math.PI / 180;
  }

  seleccionarProfesional(){
    this.dataService.useService( "get_peluqueros" , { data : this.negocioObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.peluquerosArray$ = data.data;
          this.modalReference = this.modalService.open(this.mProfesionales);
          this.modalReference.result.then((result) => {
            this.mainObject$.motofast     = result;
            this.mainObject$.motofast_id  = result._id;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
        )
      }
    );
  }

  nuevaTarjeta(){
    this.modalReference.close();
    this.modalReference = this.modalService.open(this.mNuevaTarjeta, { windowClass: 'modal-holder' } );
  }

  seleccionarFormaDePago(){
    if(!this.sePuedeModificarMedioDePago$){
      return;
    }
    this.modalReference = this.modalService.open(this.mTipoPago, { windowClass: 'modal-holder' } );
  }

  returnTipoServicio(tipo_t){
    this.mainObject$.tipo_servicio  = tipo_t;
    this.modalReference.close();
  }

  returnFormaDePago( opcion_t ){
    this.mainObject$.forma_pago     = opcion_t;
    this.mainObject$.forma_pago_id  = opcion_t._id;
    this.modalReference.close();
  }

  seleccionarTarjeta(){
    console.log("seleccionarTarjeta");
    this.dataService.useService( "get_usuario_tarjetas" , { data : this.currentUser$ } )
    .subscribe
      (
        (data : any) =>   {
          console.log(data);
          if( data.status === "success" ){
            if( data.data ){
              this.tarjetas$ = data.data;
            }else{
              this.tarjetas$ = [];
            }
            console.log("tarjetas");
            console.log(this.tarjetas$);
            this.modalReference = this.modalService.open(this.mTarjetas, { windowClass: 'modal-holder' } );
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  returnTarjeta( opcion_t ){
    this.mainObject$.tarjeta     = opcion_t;
    this.mainObject$.tarjeta_id  = opcion_t.id;
    this.modalReference.close();
  }

  calcularKMDistancia() {
    var R = 6371; // km (change this constant to get miles)
  	var dLat = (this.mainObject$.destino_latitude-this.mainObject$.origen_latitude) * Math.PI / 180;
  	var dLon = (this.mainObject$.destino_longitude-this.mainObject$.origen_longitude) * Math.PI / 180;
  	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  		Math.cos(this.mainObject$.origen_latitude * Math.PI / 180 ) * Math.cos(this.mainObject$.destino_latitude * Math.PI / 180 ) *
  		Math.sin(dLon/2) * Math.sin(dLon/2);
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  	var d = R * c;
  	if (d>1) return Math.round(d);
  	else if (d<=1) return Math.round(d*1000);
  	return d;
  }

  calcularTotalPedido(){
    this.mainObject$.total = 0;
    for( var i = 0; i<this.mainObject$.platillos.length; i++ ){
      this.mainObject$.total = this.mainObject$.total +
        this.mainObject$.platillos[i].cantidad * this.mainObject$.platillos[i].costo;
    }
    if( this.mainObject$.tipo_servicio === 2 ){
      if( this.negocioObj$.tipo_costo_envio ){
        this.mainObject$.costo_envio = 0;
        switch( this.negocioObj$.tipo_costo_envio ){
          case 1:
            // Distancias
            var distancia_en_km = this.calcularKMDistancia();
            this.mainObject$.distancia_diferencia = distancia_en_km;
            for( var i = 0; i<this.distanciasArray$.length; i++ ){
              if( (this.mainObject$.distancia_diferencia >= this.distanciasArray$[i].minimo)
                && (this.mainObject$.distancia_diferencia <= this.distanciasArray$[i].maximo) ){
                  this.mainObject$.costo_envio = parseFloat(this.distanciasArray$[i].costo);
              }
            }
          break;
          // case 2:
          //   // Repartidor
          // break;
          case 3:
            // Costo de envío fijo
            console.log(3);
            this.mainObject$.costo_envio = this.negocioObj$.costo_delivery;
          break;
        }
        this.mainObject$.total = this.mainObject$.total + this.mainObject$.costo_envio;
        if(
          ( !this.promocionEfectivo$ )
          ||
          (this.mainObject$.forma_pago_id === '5e0a904ece07baeb91675dbe')
        ){
          if(this.negocioObj$.comision){
            console.log("Aplico comision bancaria");
            this.mainObject$.comision_bancaria = 0;
            for( var i = 0; i<this.mainObject$.platillos.length; i++ ){
              this.mainObject$.comision_bancaria =
                this.mainObject$.comision_bancaria +
                  this.mainObject$.platillos[i].costo * (this.negocioObj$.comision/100) * this.mainObject$.platillos[i].cantidad;
            }
            this.mainObject$.total = this.mainObject$.total + this.mainObject$.comision_bancaria;
          }else{
            this.mainObject$.comision_bancaria = 0;
          }
        }else{
          this.mainObject$.comision_bancaria = 0;
        }
      }
    }
  }

  triggerCantidadPlatillo( tipo_t ){
    if( tipo_t === 1 ){ // Aumentar
      this.platilloSeleccionado$ .cantidad = this.platilloSeleccionado$ .cantidad + 1;
      this.platilloSeleccionado$ .total =
        parseFloat(this.platilloSeleccionado$ .costo) * parseInt(this.platilloSeleccionado$ .cantidad);
    }else{ // Disminuir
      this.platilloSeleccionado$ .cantidad = this.platilloSeleccionado$ .cantidad - 1;
      if( this.platilloSeleccionado$ .cantidad === 0 ){
        this.mainObject$.platillos.splice(this.index$,1);
      }else{
        this.platilloSeleccionado$ .total =
          parseFloat(this.platilloSeleccionado$ .costo) * parseInt(this.platilloSeleccionado$ .cantidad);
      }
    }
    this.calcularTotalPedido();
  }

  eliminarPlatillo(){
    console.log("eliminarplat");
    console.log(this.index$);
    this.mainObject$.platillos.splice(this.index$,1);
    this.calcularTotalPedido();
    this.modalReference.close();
  }

  irAMenu(){
    this.router.navigateByUrl('/cliente/perfil-restaurante', {  });
  }

  returnOpciones(){
    var restructuracion_platillo = JSON.parse(JSON.stringify(this.platilloSeleccionado$));
    restructuracion_platillo.ingredientes = [];
    delete restructuracion_platillo.grupo_ingrediente;
    if( this.platilloSeleccionado$.grupo_ingrediente.length > 0 ){
      for( var i = 0; i<this.platilloSeleccionado$.grupo_ingrediente.length; i++ ){
        if( this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes.length > 0 ){
          for( var j = 0; j<this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes.length; j++ ){

            // CHECKBOX MULTIPLE OPTIONS
            // SE REVISA SI EXISTE SELECCIONADO
            // EN CASO DE SER SELECCIONADO CHECAMOS SI TIENE COSTO Y SE SUMA EN CASO DE SI TENERLO
            if( this.platilloSeleccionado$.grupo_ingrediente[i].seleccion_multiple ){
              if( this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].seleccionado ){
                if( this.platilloSeleccionado$.grupo_ingrediente[i].genera_costo ){
                  if( this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra ){
                    if( parseFloat(this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra) > 0 ){
                      restructuracion_platillo.costo =
                        parseFloat(restructuracion_platillo.costo) + parseFloat(this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra);
                    }
                  }
                  restructuracion_platillo.ingredientes.push(
                    this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j]
                  );
                }
              }
            }else{
              // SINGLE OPTION RADIOS
              // SE REVISA QUE EXISTA AL MENOS UNO SELECCIONADO
              // EN CASO DE SER SELECCIONADO CHECAMOS SI TIENE COSTO Y SE SUMA EN CASO DE SI TENERLO
              if( !this.platilloSeleccionado$.grupo_ingrediente[i].genera_costo ){
                if( !this.platilloSeleccionado$.grupo_ingrediente[i].ingrediente_seleccionado ){
                  this.dataService.generalAlert({ "status" : "info" , "message" : "Selecciona una opción de " +this.platilloSeleccionado$.grupo_ingrediente[i].nombre });
                  return;
                }
              }
              if( this.platilloSeleccionado$.grupo_ingrediente[i].ingrediente_seleccionado ){
                if( this.platilloSeleccionado$.grupo_ingrediente[i].ingrediente_seleccionado === this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].id ){
                  if( this.platilloSeleccionado$.grupo_ingrediente[i].genera_costo ){
                    if( this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra ){
                      restructuracion_platillo.costo =
                        (parseFloat(this.platilloSeleccionado$.costo) + parseFloat(this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra));
                    }
                  }
                  restructuracion_platillo.ingredientes.push(
                    this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j]
                  );
                }
              }
            }
          }
        }
      }
    }
    this.mainObject$.platillos[this.index$] = restructuracion_platillo;
    console.log("return");
    console.log( restructuracion_platillo );
    console.log(this.mainObject$);
    console.log(this.index$);
    this.calcularTotalPedido();
    this.modalReference.close();
  }

  opcionesPlatillo( platillo_t , index_t ){
    this.index$ = index_t;
    for( var i = 0; i<this.categorias$.length; i++ ){
      for( var j = 0; j<this.categorias$[i].platillos.length; j++ ){
        console.log(this.categorias$[i].platillos[j]._id + " - " + platillo_t._id);
        if( this.categorias$[i].platillos[j]._id === platillo_t._id ){
          this.platilloSeleccionado$ = this.categorias$[i].platillos[j];
          this.platilloSeleccionado$.cantidad = platillo_t.cantidad;
          this.platilloSeleccionado$.total = platillo_t.total;
        }
      }
    }
    console.log("abrirmodalopciones");
    console.log(this.platilloSeleccionado$);
    this.modalReference = this.modalService.open(this.mOpciones, {windowClass: 'cgk-modal-full', backdrop: false});
  }

  guardarTarjeta(){
    if( !this.tarjetaObject$.number ){
      this.dataService.generalAlert( { "message" : "Completar número de tarjeta", "status" : "info" } );
      return;
    }
    if( !this.tarjetaObject$.exp_month ){
      this.dataService.generalAlert( { "message" : "Completar mes de expiración", "status" : "info" } );
      return;
    }
    if( !this.tarjetaObject$.exp_year ){
      this.dataService.generalAlert( { "message" : "Completar año de expiración", "status" : "info" } );
      return;
    }
    if( !this.tarjetaObject$.cvc ){
      this.dataService.generalAlert( { "message" : "Completar CVC", "status" : "info" } );
      return;
    }
    this.dataService.useService( "guardar_tarjeta" , { data : this.currentUser$, tarjeta : this.tarjetaObject$ } )
    .subscribe
      (
        (data : any) =>   {
          if( data.error ){
            this.dataService.generalAlert({ "status" : "error", "message" : data.error.message });
          }
          if( data.status === "success" ){
          this.modalReference.close();
            this.dataService.generalAlert(data);
            this.seleccionarTarjeta();
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  irAPedido( pedido_t ){
    this.dataService.useService( "get_pedido_by_id" , { data : pedido_t } )
    .subscribe
      (
        (data : any) =>   {
          if( data.status === "success" ){
            if( this.currentUser$.tipo_usuario_id === "5c40513258209844a83c8629" ){
              //Cliente
              this.router.navigateByUrl('/pedidos/pedido', { state: data.data[0] });
            }else{
              this.router.navigateByUrl('/pedidos/pedidoadmin', { state: data.data[0] });
            }
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  cambioNumeroPersonas(){

    this.mainObject$.decoracion_cantidad = 0;
    this.mainObject$.anticipo_cantidad   = 0;
    this.sePuedeModificarMedioDePago$    = false;

    if( this.mainObject$.numero_de_personas ){
      if( this.mainObject$.decoracion === 1 ){
        if( this.mainObject$.servicio ){
          if( this.mainObject$.servicio.precio_decoracion ){
            var decoracion_encontrada = false;
            for( var i = 0; i<this.mainObject$.servicio.precio_decoracion.length; i++ ){
              if(
                (
                  this.mainObject$.numero_de_personas >=
                  this.mainObject$.servicio.precio_decoracion[i].numero_personas_desde
                )
                &&
                (
                  this.mainObject$.numero_de_personas <=
                  this.mainObject$.servicio.precio_decoracion[i].numero_personas_hasta
                )
              ){
                this.mainObject$.decoracion_cantidad = this.mainObject$.servicio.precio_decoracion[i].costo;
                decoracion_encontrada = true;
                if( this.mainObject$.servicio.precio_decoracion[i].anticipo > 0 ){

                  this.mainObject$.servicio.anticipo = true;
                  this.mainObject$.servicio.anticipo_cantidad = this.mainObject$.servicio.precio_decoracion[i].anticipo;

                  this.mainObject$.anticipo = true;
                  this.mainObject$.anticipo_cantidad = this.mainObject$.servicio.precio_decoracion[i].anticipo;

                  this.mainObject$.pago_forzado = true;
                  this.mainObject$.pagar_ahora  = this.mainObject$.servicio.precio_decoracion[i].anticipo;

                  this.sePuedeModificarMedioDePago$ = false;
                  for( var i = 0; i<this.tiposPago$.length; i++ ){
                    if( this.tiposPago$[i]._id === "5e0a904ece07baeb91675dbe" ){
                      this.mainObject$.forma_pago     = this.tiposPago$[i];
                      this.mainObject$.forma_pago_id  = this.tiposPago$[i]._id;
                    }
                  }

                }
                this.triggerTotalReserva(undefined);
              }
            }
            if( !decoracion_encontrada ){
              this.mainObject$.decoracion_cantidad = this.mainObject$.servicio.precio_decoracion[ this.mainObject$.servicio.precio_decoracion.length-1 ].costo;
            }
          }
        }
      }
    }
  }

  validarHacerPedido(){
    if( this.currentUser$.tipo_usuario_id === "5c40513258209844a83c8629" ){
      //Cliente
      this.hacerPedidoCliente();
    }else{
      if( !this.mainObject$.inicio_cita ){
        this.dataService.generalAlert( { "message" : "Completa el horario", "status" : "info" } );
        return;
      }
      if( !this.mainObject$.servicio ){
        this.dataService.generalAlert( { "message" : "Completa la reservación", "status" : "info" } );
        return;
      }
      if( !this.mainObject$.fecha_cita ){
        this.dataService.generalAlert( { "message" : "Completa la fecha de la cita", "status" : "info" } );
        return;
      }
      if( this.negocioObj$.categoria_id === '5ee4110b31a9c57966bf37c5' ){
        if( !this.mainObject$.numero_de_personas ){
          this.dataService.generalAlert( { "message" : "Completa el número de personas", "status" : "info" } );
          return;
        }
      }
      this.modalReference = this.modalService.open(this.mCapturarCliente, { windowClass: 'modal-holder' } );
    }
  }

  hacerPedidoNegocio(){
    if( !this.cliente$.correo ){
      this.dataService.generalAlert( { "message" : "Completa el correo", "status" : "info" } );
      return;
    }
    if( !this.cliente$.telefono ){
      this.dataService.generalAlert( { "message" : "Completa el teléfono", "status" : "info" } );
      return;
    }
    if( !this.cliente$.nombre ){
      this.dataService.generalAlert( { "message" : "Completa el nombre", "status" : "info" } );
      return;
    }

    this.mainObject$.fecha_alta      = new Date();
    this.mainObject$.status          = 10; // Por aprobar listo del restaurante
    this.mainObject$.usuario_id      = this.currentUser$._id;
    this.mainObject$.negocio_id      = this.negocioObj$._id;

    if( !this.mainObject$.total ){
      this.mainObject$.pagar_totalidad = false;
      this.mainObject$.forma_pago     = this.tiposPago$[0];
      this.mainObject$.forma_pago_id  = this.tiposPago$[0]._id;
    }

    for( var i = 0; i<this.tiposPago$.length; i++ ){
      if( this.tiposPago$[i]._id === "5e0a9048ce07baeb91675dbd" ){
        this.mainObject$.forma_pago     = this.tiposPago$[i];
        this.mainObject$.forma_pago_id  = this.tiposPago$[i]._id;
      }
    }

    this.dataService.useService( "nuev_pedido_negocio" , { data : this.mainObject$, negocio : this.negocioObj$, cliente : this.cliente$ } )
    .subscribe
      (
        (data : any) =>   {
          this.modalReference.close();
          this.modalReference = this.modalService.open(this.mConfirmacionCitaNegocio, { windowClass: 'modal-holder' } );
          this.dataService.generalAlert(data);
          if( data.status === "success" ){
            this.router.navigateByUrl('/pedidos/admin', { });
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
          this.isClicked = false;
        }
    );
  }

  hacerPedidoCliente(){

    if( !this.mainObject$.forma_pago_id ){
      this.dataService.generalAlert( { "message" : "Completa una forma de pago", "status" : "info" } );
      return;
    }
    if( !this.mainObject$.inicio_cita ){
      this.dataService.generalAlert( { "message" : "Completa el horario", "status" : "info" } );
      return;
    }
    if( !this.mainObject$.servicio ){
      this.dataService.generalAlert( { "message" : "Completa la reservación", "status" : "info" } );
      return;
    }
    if( !this.mainObject$.fecha_cita ){
      this.dataService.generalAlert( { "message" : "Completa la fecha de la cita", "status" : "info" } );
      return;
    }
    if( this.negocioObj$.categoria_id === '5ee4110b31a9c57966bf37c5' ){
      if( !this.mainObject$.numero_de_personas ){
        this.dataService.generalAlert( { "message" : "Completa el número de personas", "status" : "info" } );
        return;
      }
    }
    if( this.mainObject$.forma_pago_id === '5e0a904ece07baeb91675dbe' ){
      if( !this.mainObject$.tarjeta ){
        this.dataService.generalAlert( { "message" : "Completa tu tarjeta de pago", "status" : "info" } );
        return;
      }
    }

    this.mainObject$.fecha_alta      = new Date();
    this.mainObject$.status          = 10; // Por aprobar listo del restaurante
    this.mainObject$.usuario_id      = this.currentUser$._id;
    this.mainObject$.negocio_id      = this.negocioObj$._id;

    if( !this.mainObject$.total ){
      this.mainObject$.pagar_totalidad = false;
      this.mainObject$.forma_pago     = this.tiposPago$[0];
      this.mainObject$.forma_pago_id  = this.tiposPago$[0]._id;
    }

    this.dataService.useService( "nuev_pedido" , { data : this.mainObject$, negocio : this.negocioObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.modalReference = this.modalService.open(this.mConfirmacionCitaCliente, { windowClass: 'modal-holder' } );
          this.dataService.generalAlert(data);
          if( data.status === "success" ){
            // this.irAPedido(data);
            this.router.navigateByUrl('/pedidos/listado', { });
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
          this.isClicked = false;
        }
    );

  }

  getTiposPago(){
    this.tiposPago$ = [];
    this.dataService.useService( "get_tipo_pago" , { usuario : this.currentUser$, negocio : this.negocioObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.tiposPago$ = data.data;
            if(this.tiposPago$.length > 0){
              this.mainObject$.forma_pago     = this.tiposPago$[0];
              this.mainObject$.forma_pago_id  = this.tiposPago$[0]._id;
            }
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getCategorias(){
    this.dataService.useService( "get_categorias_negocio" , { data : this.negocioObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.categorias$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getConfiguracion(){
    this.dataService.useService( "get_configuracion" , {} )
    .subscribe
      (
          (data : any) =>   {
            this.configuracion$ = data.data[0];
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getDistancias(){
    this.dataService.useService( "get_distancias" , { data : this.negocioObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.distanciasArray$ = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getPromocionEfectivo(){
    this.dataService.useService( "get_promocion_pago_efectivo_sin_comision" , { } )
    .subscribe
      (
          (data : any) =>   {
            this.promocionEfectivo$ = data.data;
            this.calcularTotalPedido();
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  getNegocioById(){
    this.dataService.useService( "get_negocio_by_id" , { data : { _id : this.negocioObj$.marca_id } } )
    .subscribe
      (
          (data : any) =>   {
            this.negocioObj$.galeria = data.data[0].galeria;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  ngOnInit() {

    this.modalMaxHeight$          = window.innerHeight*.70+"px";
    this.currentUser$             = this.authenticationService.currentUserValue;

    if( this.currentUser$.tipo_usuario_id === "5c40513258209844a83c8629" ){
      //Cliente
      this.negocioObj$              = history.state.negocio;
      this.negocioOtrosParametros$  = history.state.negocio;
      this.mainObject$.telefono     = this.currentUser$.telefono;
    }else{
      if( !this.currentUser$.negocio.main ){
        this.negocioObj$              = this.currentUser$.negocio;
        this.negocioOtrosParametros$  = this.currentUser$.negocio;
        this.negocioObj$.galeria      = [];
      }else{
        this.negocioObj$              = history.state.negocio;
        this.negocioOtrosParametros$  = history.state.negocio;
      }
    }

    // this.mainObject$              = this.authenticationService.currentPedidoValue;
    this.mainObject$ = new Pedido();
    console.log(this.mainObject$);
    console.log(this.negocioObj$);

    if(history.state.servicio){
      if(history.state.servicio._id){
        this.returnServicio(history.state.servicio);
      }
    }

    if( !this.negocioObj$.latitude ){
      this.dataService.generalAlert( { "message" : "Completa tu ubicación en la sección de arriba para continuar con tu pedido", "status" : "info" } );
      this.router.navigateByUrl('/cliente/seleccion-negocio', { });
      return;
    }else{
      this.recalcularDistancia(null);
    }

    this.mainObject$.origen_direccion = this.negocioObj$.direccion;
    this.mainObject$.origen_latitude  = this.negocioObj$.location.coordinates[1];
    this.mainObject$.origen_longitude = this.negocioObj$.location.coordinates[0];

    if( this.currentUser$.tipo_usuario_id === "5c40513258209844a83c8629" ){
      this.mainObject$.destino_direccion = this.currentUser$.direccion;
      this.mainObject$.destino_latitude  = this.currentUser$.latitude;
      this.mainObject$.destino_longitude = this.currentUser$.longitude;
    }else{
      this.cliente$ = new Usuario();
      this.mainObject$.destino_direccion = this.cliente$.direccion;
      this.mainObject$.destino_latitude  = this.cliente$.latitude;
      this.mainObject$.destino_longitude = this.cliente$.longitude;
    }

    delete this.mainObject$.inicio_cita;
    delete this.mainObject$.fin_cita;

    this.getTiposPago();
    this.getServicios();
    this.getNegocioById();
    // this.getCategorias();
    // this.getConfiguracion();
    // this.getDistancias();
    // this.getPromocionEfectivo();

  }

}
