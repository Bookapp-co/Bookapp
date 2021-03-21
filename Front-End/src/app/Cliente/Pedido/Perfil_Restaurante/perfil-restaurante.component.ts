import { ElementRef, Component, OnInit, NgZone, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';
import {ngxLoadingAnimationTypes, NgxLoadingComponent} from 'ngx-loading';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../../_services/authentication.service';
import {animate, query, style, transition, trigger} from '@angular/animations';
import { Negocio } from '../../../_models/negocio.model';
import { Pedido } from '../../../_models/pedido.model';
import { Ubicacion } from '../../../_models/ubicacion.model';
import { Categoria } from '../../../_models/categoria.model';
import { Configuracion } from '../../../_models/configuracion.model';
import { MapsAPILoader } from '@agm/core';

declare let google: any;

@Component({
  selector: 'cliente-perfil-restaurante',
  templateUrl: './perfil-restaurante.component.html',
  animations: [

    trigger('restaurantes', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ])
  ]
})
export class PerfilRestauranteComponent implements OnInit {

  negocioObj$ = new Negocio();
  ubicacionObj$ = new Ubicacion();
  configuracion$ = new Configuracion();
  mainObject$ = new Pedido();
  categoriaSeleccionada$ = new Categoria();
  mainArray$: [];
  distanciasArray$: any;
  pedidosArray$: [];
  currentUser$ : any;
  modalReference: any;
  modalReference2: any;
  geocoder : any;
  mensaje$ : any;
  negocioOtrosParametros$ : any;
  platilloSeleccionado$ : any;
  platilloSeleccionadoVista$ : any;
  templateUnchecked:any;
  index$:any;
  searchText = "";
  isActive = true;

  modalMaxHeight$:any;

  slideConfig2 = {
    className: 'center',
    centerMode: false,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 3,
    slidesToScroll: 3,
    speed: 500,
    dots: false,
    arrows: false
  };

  slick$ : any;
  slideConfig4 = {
    className: 'center',
    centerMode: false,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 3,
    dots: false,
    arrows: false,
    initialSlide : 0,
    focusOnSelect : true,
    swipeToSlide: true
  };

  slick2$ : any;

  slideGaleria = {
    className: '',
    centerMode: true,
    infinite: true,
    centerPadding: '75px',
    slidesToShow: 1,
    dots: false,
    arrows: true,
    initialSlide : 0,
    swipeToSlide: true
  };


  @ViewChild('mTuPedido') mTuPedido: TemplateRef<any>;
  @ViewChild('mCambiarUbicacion') mCambiarUbicacion: TemplateRef<any>;
  @ViewChild('mFinalizacionPedido') mFinalizacionPedido: TemplateRef<any>;
  @ViewChild('mMensaje') mMensaje: TemplateRef<any>;
  @ViewChild('mOpciones') mOpciones: TemplateRef<any>;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService : DataService ,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal
  ){
    // authenticationService.changeUserInfo.subscribe(user => this.changeUser(user));
    authenticationService.getUbicacion.subscribe(data => this.recalcularDistancia(data));
  }

  slickInit2(e){
    this.slick2$ = e.slick;
  }

  regresar(){
    this.router.navigateByUrl('/cliente/seleccion-negocio', {  });
  }

  abrirUbicacion(){
    this.router.navigate(['pages/ubicaciones'], { state : { regresar : '/cliente/perfil-restaurante' } });
  }

  afterChange(e){
    console.log(this.negocioObj$.categorias[e.currentSlide]);
    console.log(e.currentSlide);
    this.seleccionarCategoria( this.negocioObj$.categorias[e.currentSlide], e.currentSlide, 1 );
  }

  slickInit(e){
    this.slick$ = e.slick;
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
    return d;
  }

  toRad(Value){
      return Value * Math.PI / 180;
  }

  seleccionarCategoria( categoria_t, index_t, tipo_trigger ){
    this.index$ = index_t;
    console.log("seleccionCategoria");
    if( tipo_trigger === 2 ){
      if(categoria_t.expand){
        categoria_t.expand = false;
        return;
      }
    }
    this.categoriaSeleccionada$ = categoria_t;
    console.log(this.categoriaSeleccionada$._id);
    console.log(this.categoriaSeleccionada$.platillos);
    for( var i = 0; i<this.negocioObj$.categorias.length; i++ ){
      this.negocioObj$.categorias[i].expand = false;
      this.negocioObj$.categorias[i].platillos = [];
    }
    this.negocioObj$.categorias[index_t].expand = true;
    this.dataService.useService( "get_platillos_by_categoria_id" , { data : this.negocioObj$.categorias[index_t] } )
    .subscribe
      (
          (data : any) =>   {
            this.categoriaSeleccionada$.platillos = data.data;
            for( var i = 0; i<data.data.length; i++ ){
              if( data.data[i].promocion ){
                // data.data[i].calculado_descuento = (data.data[i].costo*100)/(100-data.data[i].promocion_total);
                // console.log(data.data[i]);
                data.data[i].calculado_descuento = data.data[i].costo;
                data.data[i].costo = data.data[i].costo - (data.data[i].costo*data.data[i].promocion_total)/100;
              }
            }
            this.changeDetectorRef.detectChanges();
            // this.negocioObj$.categorias[index_t].platillos = data.data;
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
  }

  opcionesPlatillo( platillo_t ){

    platillo_t.cantidad = 1;
    this.platilloSeleccionado$ = platillo_t;
    this.platilloSeleccionadoVista$ = JSON.parse(JSON.stringify(this.platilloSeleccionado$));
    console.log(this.platilloSeleccionado$);
    this.modalReference = this.modalService.open(this.mOpciones, {windowClass: 'cgk-modal-full', backdrop: false});

    // if( platillo_t.grupo_ingrediente.length > 0 ){
    //   this.modalReference = this.modalService.open(this.mOpciones);
    // }else{
    //   var restructuracion_platillo = JSON.parse(JSON.stringify(platillo_t));
    //   this.agregarPlatillo( restructuracion_platillo );
    // }

  }

  platilloPropiedadesCambio(){
    this.platilloSeleccionadoVista$ = JSON.parse(JSON.stringify(this.platilloSeleccionado$));
    if( this.platilloSeleccionado$.grupo_ingrediente.length > 0 ){
      for( var i = 0; i<this.platilloSeleccionado$.grupo_ingrediente.length; i++ ){
        if( this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes.length > 0 ){
          for( var j = 0; j<this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes.length; j++ ){
            if( this.platilloSeleccionado$.grupo_ingrediente[i].seleccion_multiple ){
              if( this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].seleccionado ){
                if( this.platilloSeleccionado$.grupo_ingrediente[i].genera_costo ){
                  if( this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra ){
                    if( parseFloat(this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra) > 0 ){
                      this.platilloSeleccionadoVista$.costo =
                        parseFloat(this.platilloSeleccionadoVista$.costo) + parseFloat(this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra);
                    }
                  }
                }
              }
            }else{
              if( this.platilloSeleccionado$.grupo_ingrediente[i].ingrediente_seleccionado ){
                if( this.platilloSeleccionado$.grupo_ingrediente[i].ingrediente_seleccionado === this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].id ){
                  if( this.platilloSeleccionado$.grupo_ingrediente[i].genera_costo ){
                    if( this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra ){
                      this.platilloSeleccionadoVista$.costo =
                        (parseFloat(this.platilloSeleccionado$.costo) + parseFloat(this.platilloSeleccionado$.grupo_ingrediente[i].ingredientes[j].extra));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    this.platilloSeleccionadoVista$.costo = this.platilloSeleccionadoVista$.cantidad * this.platilloSeleccionadoVista$.costo;
  }

  triggerCantidadPlatillo( tipo_t ){
    if( tipo_t === 1 ){ // Aumentar
      this.platilloSeleccionado$.cantidad = this.platilloSeleccionado$.cantidad + 1;
      this.platilloSeleccionado$.total =
        parseFloat(this.platilloSeleccionado$.costo) * parseInt(this.platilloSeleccionado$.cantidad);
    }else{ // Disminuir
      this.platilloSeleccionado$.cantidad = this.platilloSeleccionado$.cantidad - 1;
      this.platilloSeleccionado$.total =
        parseFloat(this.platilloSeleccionado$.costo) * parseInt(this.platilloSeleccionado$.cantidad);
    }
    this.platilloPropiedadesCambio();
    this.calcularTotalPedido();
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
    this.platilloSeleccionado$ = {};
    this.modalReference.close();
    this.agregarPlatillo( restructuracion_platillo );
  }

  clickIngrediente( grupo_t, ingrediente_t ){
    if( grupo_t.ingrediente_seleccionado ){
      if( grupo_t.ingrediente_seleccionado.id === ingrediente_t.id ){
        grupo_t.ingrediente_seleccionado = undefined;
      }
    }
  }

  agregarPlatillo( platillo_t ){
    if( !this.mainObject$.platillos ){
      this.mainObject$.platillos = [];
      platillo_t.total = platillo_t.costo * platillo_t.cantidad;
      this.mainObject$.platillos.push( platillo_t );
    }else{
      // let platillo_agregado = false;
      // for( var i = 0; i<this.mainObject$.platillos.length; i++ ){
      //   if( this.mainObject$.platillos[i]._id === platillo_t._id ){
      //     platillo_agregado = true;
      //     this.mainObject$.platillos[i].cantidad = this.mainObject$.platillos[i].cantidad + 1;
      //     this.mainObject$.platillos[i].total =
      //       this.mainObject$.platillos[i].costo * this.mainObject$.platillos[i].cantidad;
      //   }
      // }
      // if( !platillo_agregado ){
      //   platillo_t.cantidad = 1;
      //   platillo_t.total = parseFloat(platillo_t.costo);
      //   this.mainObject$.platillos.push( platillo_t );
      // }
      // platillo_t.cantidad = 1;
      platillo_t.total = parseFloat(platillo_t.costo);
      this.mainObject$.platillos.push( platillo_t );
    }
    this.calcularTotalPedido();
    this.authenticationService.setPedido(this.mainObject$);
    localStorage.setItem('pedido_bookapp_App', JSON.stringify(this.mainObject$));
    // this.modalReference2 = this.modalService.open(this.mTuPedido);
  }

  abrirDetallePedido(){
    if( this.mainObject$.total < this.negocioObj$.costo_minimo ){
      this.dataService.generalAlert( { "message" : "El pedido mínimo del negocio es de " + this.negocioObj$.costo_minimo, "status" : "info" } );
      return;
    }
    // this.modalReference2 = this.modalService.open(this.mTuPedido);
    if( this.mainObject$.platillos.length === 0 ){
      this.dataService.generalAlert( { "message" : "Selecciona algun producto para pasar al carrito.", "status" : "info" } );
      return;
    }
    this.authenticationService.setPedido(this.mainObject$);
    localStorage.setItem('pedido_bookapp_App', JSON.stringify(this.mainObject$));
    this.router.navigateByUrl('/pedidos/checkout', { state : this.negocioObj$ });
  }

  calcularTotalPedido(){
    this.mainObject$.total = 0;
    for( var i = 0; i<this.mainObject$.platillos.length; i++ ){
      this.mainObject$.total = this.mainObject$.total +
        this.mainObject$.platillos[i].cantidad * this.mainObject$.platillos[i].costo;
    }
  }

  getCategorias(){
    this.dataService.useService( "get_categorias_negocio_sin_platillos" , { data : this.negocioObj$ } )
    .subscribe
      (
          (data : any) =>   {
            this.negocioObj$.categorias = data.data;
            // if( this.negocioObj$.categoria.tipo_listado === 1 ){
            //   this.seleccionarCategoria( this.negocioObj$.categorias[0], 0, 1 );
            // }
            this.seleccionarCategoria( this.negocioObj$.categorias[0], 0, 1 );
          },
          error =>  {
            this.dataService.generalAlert(error);
          }
    );
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

  finalizacionPedido(){
    if( !this.mainObject$.destino_direccion ){
      this.dataService.generalAlert( { "message" : "Completa la ubicación de entrega para continuar.", "status" : "error" } );
      return;
    }
    if( !this.mainObject$.destino_latitude ){
      this.dataService.generalAlert( { "message" : "Completa la ubicación de entrega para continuar.", "status" : "error" } );
      return;
    }
    if( !this.mainObject$.destino_longitude ){
      this.dataService.generalAlert( { "message" : "Completa la ubicación de entrega para continuar.", "status" : "error" } );
      return;
    }
    this.modalReference2.close();
    this.modalReference = this.modalService.open(this.mFinalizacionPedido);
  }

  seleccionarFormaDePago(){
    this.mensaje$ = "Por el momento solo está habilitado el pago con efectivo. ¡Estamos trabajando en integrar pagos con tarjetas muy pronto!";
    this.modalReference = this.modalService.open(this.mMensaje);
  }

  hacerPedido(){

    if( !this.mainObject$.referencia ){
      this.dataService.generalAlert( { "message" : "Completa la referencia de tu ubicación.", "status" : "error" } );
      return;
    }
    if( !this.mainObject$.telefono ){
      this.dataService.generalAlert( { "message" : "Completa tu teléfono.", "status" : "error" } );
      return;
    }

    this.mainObject$.origen_direccion = this.negocioOtrosParametros$.direccion;
    this.mainObject$.origen_latitude  = this.negocioOtrosParametros$.location.coordinates[1];
    this.mainObject$.origen_longitude = this.negocioOtrosParametros$.location.coordinates[0];

    var distancia_en_km = this.calcularKMDistancia();
    this.mainObject$.distancia_diferencia = distancia_en_km;
    for( var i = 0; i<this.distanciasArray$.length; i++ ){
      if( (this.mainObject$.distancia_diferencia > this.distanciasArray$[i].minimo)
        && (this.mainObject$.distancia_diferencia < this.distanciasArray$[i].maximo) ){
          this.mainObject$.subtotal = this.mainObject$.total;
          this.mainObject$.costo_envio = parseFloat(this.distanciasArray$[i].costo);
          this.mainObject$.total = this.mainObject$.total + this.mainObject$.costo_envio;
      }
    }
    this.mainObject$.fecha_alta      = new Date();
    this.mainObject$.tipo_servicio   = 2;
    this.mainObject$.status          = 10; // Por aprobar listo del restaurante
    this.mainObject$.usuario_id      = this.currentUser$._id;
    this.mainObject$.negocio_id      = this.negocioObj$._id;
    if( !this.mainObject$.destino_latitude ){
      this.dataService.generalAlert( { "message" : "Completa la ubicación de entrega de tus productos.", "status" : "error" } );
      return;
    }



    this.dataService.useService( "nuev_pedido" , { data : this.mainObject$, negocio : this.negocioObj$ } )
    .subscribe
      (
        (data : any) =>   {
          this.dataService.generalAlert(data);
          if( data.status === "success" ){
            this.modalReference.close();
            this.irAPedido(data);
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
            this.router.navigateByUrl('/pedidos/pedido', { state: data.data[0] });
          }
        },
        error =>  {
          this.dataService.generalAlert(error);
        }
    );
  }

  seleccionarDireccion(nuevasCoordenadasT){
    this.mainObject$.destino_direccion    = nuevasCoordenadasT.direccion;
    this.mainObject$.destino_latitude     = nuevasCoordenadasT.latitude;
    this.mainObject$.destino_longitude    = nuevasCoordenadasT.longitude;
    this.modalReference.close();
  }

  cambiarUbicacion( $event ){

    $event.srcElement.blur();
    $event.preventDefault();

    if( this.mainObject$.destino_direccion ){
      this.ubicacionObj$.direccion    = this.mainObject$.destino_direccion;
    }
    if( this.mainObject$.destino_latitude ){
      this.ubicacionObj$.latitude     = this.mainObject$.destino_latitude;
    }
    if( this.mainObject$.destino_longitude ){
      this.ubicacionObj$.longitude    = this.mainObject$.destino_longitude;
    }

    this.modalReference = this.modalService.open(this.mCambiarUbicacion);

  }

  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.mainObject$.destino_latitude  = position.coords.latitude;
        this.mainObject$.destino_longitude = position.coords.longitude;
        this.getDireccionDestino();
      });
    }
  }

  getDireccionDestino(){
    let latlng = { lat: this.mainObject$.destino_latitude, lng: this.mainObject$.destino_longitude };
    this.geocoder.geocode({ 'location' : latlng }, (results, status) => this.ngZone.run(() => {
      if (results[0]) {
        this.mainObject$.destino_direccion = results[0].formatted_address;
      } else {
        this.dataService.generalAlert({ "status" : "info" , "message" : "No pudimos encontrar tu ubicación para preCompletar el destino del pedido" });
      }
    }));
  }

  getDistancias(){
    this.dataService.useService( "get_distancias" , {  } )
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

  ngOnDestroy(){
    this.authenticationService.setPedido(this.mainObject$);
    localStorage.setItem('pedido_bookapp_App', JSON.stringify(this.mainObject$));
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

  ngOnInit() {
    this.templateUnchecked = false;
    this.currentUser$ = this.authenticationService.currentUserValue;
    this.modalMaxHeight$ = window.innerHeight*.80+"px";
    console.log(history.state);
    if( history.state.negocio ){
      if( history.state.negocio._id ){
        this.negocioObj$ = history.state.negocio;
        this.negocioOtrosParametros$ = history.state.negocio;
        if( !this.negocioObj$.banner_image ){
          this.negocioObj$.banner_image = "https://www.codigeek.com/projects/bookapp/background_negocio.png";
        }
      }else{
        this.negocioObj$ = JSON.parse(localStorage.getItem('negocio_bookapp'));
      }
    }else{
      this.negocioObj$ = JSON.parse(localStorage.getItem('negocio_bookapp'));
    }
    if(!this.negocioObj$){
      this.router.navigateByUrl('/cliente/seleccion-categoria', { });
    }else{
      localStorage.setItem('negocio_bookapp', JSON.stringify(this.negocioObj$));
    }
    console.log(this.negocioObj$);
    this.mapsAPILoader.load().then(() => {
      // this.mainObject$.telefono       = this.currentUser$.telefono;
      // this.mainObject$.forma_pago     =
      // { "_id" : "5d9fa677f7101c5be6f63ccd", "descripcion" : "Efectivo" };
      // this.mainObject$.forma_pago_id  = "5d9fa677f7101c5be6f63ccd";
      this.geocoder = new google.maps.Geocoder;
      this.setCurrentPosition();
    });

    if( history.state.get_pedido_guardado ){
      this.mainObject$ = this.authenticationService.getPedido();
    }

    this.getCategorias();
    this.getConfiguracion();
  }

}
