
import { Component, OnInit } from '@angular/core';
import { NgbTabset, NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';


import { DataService } from '../../data.service';
import { Color } from 'ng2-charts/ng2-charts';
import * as XLSX from 'xlsx';

import { Dashboard_Filtro } from '../../_models/dashboard_filtro.model';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class AnalyticsNegocioComponent implements OnInit {

  heading = 'Estadísticas de Delivery';
  subheading = 'Información de gestión de pedidos.';
  icon = 'pe-7s-plane icon-gradient bg-tempting-azure';
  param = {value: 'world'};
  pedidosArrayExcel$ = [];
  mainArray2$ = [];

  slideConfig6 = {
    className: 'center',
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    adaptiveHeight: true,
    dots: true,
  };

  public datasets = [
    {
      label: 'My First dataset',
      data: [65, 59, 80, 81, 46, 55, 38, 59, 80],
      datalabels: {
        display: false,
      },

    }
  ];

  public datasets2 = [
    {
      label: 'My First dataset',
      data: [46, 55, 59, 80, 81, 38, 65, 59, 80],
      datalabels: {
        display: false,
      },

    }
  ];

  public datasets3 = [
    {
      label: 'My First dataset',
      data: [65, 59, 80, 81, 55, 38, 59, 80, 46],
      datalabels: {
        display: false,
      },

    }
  ];
  public lineChartColors: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(247, 185, 36, 0.2)',
      borderColor: '#f7b924',
      borderCapStyle: 'round',
      borderDash: [],
      borderWidth: 4,
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: '#f7b924',
      pointBackgroundColor: '#fff',
      pointHoverBorderWidth: 4,
      pointRadius: 6,
      pointBorderWidth: 5,
      pointHoverRadius: 8,
      pointHitRadius: 10,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#f7b924',
    },
  ];

  public lineChartColors2: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(48, 177, 255, 0.2)',
      borderColor: '#30b1ff',
      borderCapStyle: 'round',
      borderDash: [],
      borderWidth: 4,
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: '#30b1ff',
      pointBackgroundColor: '#ffffff',
      pointHoverBorderWidth: 4,
      pointRadius: 6,
      pointBorderWidth: 5,
      pointHoverRadius: 8,
      pointHitRadius: 10,
      pointHoverBackgroundColor: '#ffffff',
      pointHoverBorderColor: '#30b1ff',
    },
  ];

  public lineChartColors3: Color[] = [
    { // dark grey
      backgroundColor: 'rgba(86, 196, 121, 0.2)',
      borderColor: '#56c479',
      borderCapStyle: 'round',
      borderDash: [],
      borderWidth: 4,
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: '#56c479',
      pointBackgroundColor: '#fff',
      pointHoverBorderWidth: 4,
      pointRadius: 6,
      pointBorderWidth: 5,
      pointHoverRadius: 8,
      pointHitRadius: 10,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#56c479',
    },
  ];

  public options = {
    layout: {
      padding: {
        left: 0,
        right: 8,
        top: 20,
        bottom: 0
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          beginAtZero: true
        },
        gridLines: {
          display: false
        }
      }],
      xAxes: [{
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }]
    },
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false
  };

  currentUser$ : any;
  profitPedidos$ = 0;
  profitPedidosCompletados$ = 0;
  profitPedidosEnCurso$ = 0;
  profitPedidosCancelados$ = 0;
  clientesArray$ = [];
  pedidosArray$ = [];
  pedidosCompletadosArray$ = [];
  pedidosEnCursoArray$ = [];
  pedidosCanceladosArray$ = [];
  pedidosSucursalesArray$ = [];
  pedidosArrayGrafica$ = [];
  pedidosArrayGrafica_Dataset$ = [
    {
      label: '',
      data: [],
      datalabels: {
        display: false,
      },
    }
  ];
  labels = [];
  filtros$ = new Dashboard_Filtro();

  constructor(
     private dataService: DataService,
     private authenticationService: AuthenticationService
   ){

   }

   triggerOperacionNegocio(){
     var status_t = 4;
     if( this.currentUser$.negocio.status === 4 || this.currentUser$.negocio.status === 5 ){
       status_t = 1;
     }
     this.dataService.useService( "actualizar_negocio_estatus" , { data : { status : status_t }, negocio : this.currentUser$.negocio } )
     .subscribe
       (
           (data : any) =>   {
             this.dataService.generalAlert(data);
             this.currentUser$.negocio.status = status_t;
             this.authenticationService.setUserNoRedirect(this.currentUser$);
           },
           error =>  {
             this.dataService.generalAlert(error);
           }
     );
   }

   exportarXls(): void{
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.pedidosArrayExcel$);
     const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
     XLSX.writeFile(workbook, "registros.xlsx");
   }

   groupByDates(data){
     // this gives an object with dates as keys
    const groups = data.reduce((groups, game) => {
      const date = game.fecha_alta.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});

    // Edit: to add it in the array format instead
    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        games: groups[date]
      };
    });

    return groupArrays;
   }

   cambioFecha( fecha_t ){
     console.log("cambioFecha");
     console.log(fecha_t);
     console.log(this.filtros$);
     this.labels = [];

     this.pedidosArray$ = [];

     this.pedidosCompletadosArray$ = [];
     this.pedidosEnCursoArray$ = [];
     this.pedidosCanceladosArray$ = [];

     this.pedidosSucursalesArray$ = [];

     this.pedidosArrayGrafica$ = [];
     this.pedidosArrayExcel$ = [];
     this.pedidosArrayGrafica_Dataset$[0].data = [];

     this.profitPedidos$ = 0;
     this.profitPedidosCompletados$ = 0;
     this.profitPedidosEnCurso$ = 0;
     this.profitPedidosCancelados$ = 0;
     this.getPedidos();
   }

   getClientes(){
     this.dataService.useService( "get_usuarios_clientes" , { data : this.currentUser$ } )
     .subscribe
       (
           (data : any) =>   {
             this.clientesArray$ = data.data;
           },
           error =>  {
             this.dataService.generalAlert(error);
           }
     );
   }

   getPedidos(){
     if( this.currentUser$.tipo_usuario_id === "5c4050f358209844a83c8622" ){
       this.dataService.useService( "get_pedidos_administracion_dashboard" , { data : this.currentUser$, filtro : this.filtros$ } )
       .subscribe
         (
             (data : any) =>   {

               this.pedidosArray$ = data.data;

               console.log(this.pedidosArray$);

               for( var i = 0; i<this.pedidosArray$.length; i++ ){

                 //Filtrar por revision_status
                 if( this.pedidosArray$[i].status === 4 || this.pedidosArray$[i].status === 5 ){
                   this.pedidosCompletadosArray$.push(
                     this.pedidosArray$[i]
                   );
                   this.profitPedidosCompletados$ =
                    this.profitPedidosCompletados$ +
                    this.pedidosArray$[i].total;
                 }
                 if(
                    this.pedidosArray$[i].status === 1 ||
                    this.pedidosArray$[i].status === 2 ||
                    this.pedidosArray$[i].status === 3
                   ){
                   this.pedidosEnCursoArray$.push(
                     this.pedidosArray$[i]
                   );
                   this.profitPedidosEnCurso$ =
                    this.profitPedidosEnCurso$ +
                    this.pedidosArray$[i].total;
                 }
                 if( this.pedidosArray$[i].status === 15 ){
                   this.pedidosCanceladosArray$.push(
                     this.pedidosArray$[i]
                   );
                   this.profitPedidosCancelados$ =
                    this.profitPedidosCancelados$ +
                    this.pedidosArray$[i].total;
                 }
                 // Omitir pedidos cancelados
                 if( this.pedidosArray$[i].status != 15 ){
                   this.profitPedidos$ =
                    this.profitPedidos$ + this.pedidosArray$[i].total;
                 }

                 // Filtrado por sucursales
                 var sucursal_encontrada = false;
                 var sucursal_encontrada_index = 0;
                 for( var j = 0; j<this.pedidosSucursalesArray$.length; j++ ){
                   if(
                     this.pedidosArray$[i].negocio._id ===
                     this.pedidosSucursalesArray$[j].negocio_id
                   ){
                     sucursal_encontrada = true;
                     sucursal_encontrada_index = j;
                     // this.pedidosSucursalesArray$[j].pedidos.push(
                     //   this.pedidosArray$[i]
                     // );
                     // this.pedidosSucursalesArray$[j].total =
                     // this.pedidosSucursalesArray$[j].total + this.pedidosArray$[i].total;
                   }
                 }
                 if(!sucursal_encontrada){
                   this.pedidosSucursalesArray$.push({
                    "negocio_id" : this.pedidosArray$[i].negocio._id,
                    "nombre" : this.pedidosArray$[i].negocio.nombre,
                    "total_confirmados"   : 0,
                    "total_pendientes"    : 0,
                    "total_cancelados"    : 0,
                    "total_todos"         : 0,
                    "pedidos_confirmados" : [ ],
                    "pedidos_pendientes"  : [ ],
                    "pedidos_cancelados"  : [ ],
                    "pedidos_total"       : [ ]
                   });
                 }
                 if(
                     this.pedidosArray$[i].status === 4 ||
                     this.pedidosArray$[i].status === 5
                   ){
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].pedidos_confirmados.push(
                       this.pedidosArray$[i]
                     );
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_confirmados =
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_confirmados + this.pedidosArray$[i].total;
                 }
                 if(
                     this.pedidosArray$[i].status === 1 ||
                     this.pedidosArray$[i].status === 2 ||
                     this.pedidosArray$[i].status === 3
                   ){
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].pedidos_pendientes.push(
                       this.pedidosArray$[i]
                     );
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_pendientes =
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_pendientes + this.pedidosArray$[i].total;
                 }
                 if(
                    this.pedidosArray$[i].status === 15
                   ){
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].pedidos_cancelados.push(
                       this.pedidosArray$[i]
                     );
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_cancelados =
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_cancelados + this.pedidosArray$[i].total;
                 }
                 this.pedidosSucursalesArray$[ sucursal_encontrada_index ].pedidos_total.push(
                   this.pedidosArray$[i]
                 );
                 this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_todos =
                 this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_todos + this.pedidosArray$[i].total;

                 this.pedidosArray$[i].comision = 0;
                 if( this.currentUser$.negocio.comision ){
                   this.pedidosArray$[i].comision = (this.pedidosArray$[i].total*this.currentUser$.negocio.comision)/100;
                 }

                 // Armado de excel
                 this.pedidosArrayExcel$.push({
                   "identificador" : this.pedidosArray$[i]._id,
                   "fecha_alta" : this.pedidosArray$[i].fecha_alta,
                   "sucursal" : this.pedidosArray$[i].negocio.nombre,
                   "cliente" : this.pedidosArray$[i].usuario.nombre,
                   "forma_pago" : this.pedidosArray$[i].forma_pago.descripcion,
                   "total" : this.pedidosArray$[i].total ? this.pedidosArray$[i].total.toFixed(2) : 0,
                   "comision" : this.pedidosArray$[i].comision ? this.pedidosArray$[i].comision.toFixed(2) : 0,
                   "platillos" : this.pedidosArray$[i].platillos.length,
                   "estado" :
                   this.pedidosArray$[i].status === 1 ? "Preparando pedido" :
                   (this.pedidosArray$[i].status === 2 && this.pedidosArray$[i].tipo_servicio === 1) ? "Buscando tu auto" :
                   (this.pedidosArray$[i].status === 2 && this.pedidosArray$[i].tipo_servicio === 2) ? "Rumbo a tu domicilio" :
                   this.pedidosArray$[i].status === 3 ? "Pedido entregado" :
                   this.pedidosArray$[i].status === 10 ? "Esperando confirmación" :
                   this.pedidosArray$[i].status === 15 ? "Pedido cancelado" :
                   "Desconocido"
                 });
               }

               this.pedidosArrayGrafica$ = this.groupByDates(this.pedidosArray$);

               for( var i = 0; i<this.pedidosArrayGrafica$.length; i++ ){
                 this.pedidosArrayGrafica_Dataset$[0].data.push(
                   this.pedidosArrayGrafica$[i].games.length
                 );
                 this.labels.push(
                   this.pedidosArrayGrafica$[i].date
                 );
               }
               console.log("Pedidos");
               console.log(this.pedidosSucursalesArray$);
             },
             error =>  {
               this.dataService.generalAlert(error);
             }
       );
     }else{
       this.dataService.useService( "get_pedidos_negocio_dashboard" , { data : this.currentUser$, filtro : this.filtros$ } )
       .subscribe
         (
             (data : any) =>   {

               this.pedidosArray$ = data.data;

               console.log(this.pedidosArray$);

               for( var i = 0; i<this.pedidosArray$.length; i++ ){

                 //Filtrar por revision_status
                 if( this.pedidosArray$[i].status === 4 || this.pedidosArray$[i].status === 5 ){
                   this.pedidosCompletadosArray$.push(
                     this.pedidosArray$[i]
                   );
                   this.profitPedidosCompletados$ =
                    this.profitPedidosCompletados$ +
                    this.pedidosArray$[i].total;
                 }
                 if(
                    this.pedidosArray$[i].status === 1 ||
                    this.pedidosArray$[i].status === 2 ||
                    this.pedidosArray$[i].status === 3
                   ){
                   this.pedidosEnCursoArray$.push(
                     this.pedidosArray$[i]
                   );
                   this.profitPedidosEnCurso$ =
                    this.profitPedidosEnCurso$ +
                    this.pedidosArray$[i].total;
                 }
                 if( this.pedidosArray$[i].status === 15 ){
                   this.pedidosCanceladosArray$.push(
                     this.pedidosArray$[i]
                   );
                   this.profitPedidosCancelados$ =
                    this.profitPedidosCancelados$ +
                    this.pedidosArray$[i].total;
                 }
                 // Omitir pedidos cancelados
                 if( this.pedidosArray$[i].status != 15 ){
                   this.profitPedidos$ =
                    this.profitPedidos$ + this.pedidosArray$[i].total;
                 }

                 // Filtrado por sucursales
                 var sucursal_encontrada = false;
                 var sucursal_encontrada_index = 0;
                 for( var j = 0; j<this.pedidosSucursalesArray$.length; j++ ){
                   if(
                     this.pedidosArray$[i].negocio._id ===
                     this.pedidosSucursalesArray$[j].negocio_id
                   ){
                     sucursal_encontrada = true;
                     sucursal_encontrada_index = j;
                     // this.pedidosSucursalesArray$[j].pedidos.push(
                     //   this.pedidosArray$[i]
                     // );
                     // this.pedidosSucursalesArray$[j].total =
                     // this.pedidosSucursalesArray$[j].total + this.pedidosArray$[i].total;
                   }
                 }
                 if(!sucursal_encontrada){
                   this.pedidosSucursalesArray$.push({
                    "negocio_id" : this.pedidosArray$[i].negocio._id,
                    "nombre" : this.pedidosArray$[i].negocio.nombre,
                    "total_confirmados"   : 0,
                    "total_pendientes"    : 0,
                    "total_cancelados"    : 0,
                    "total_todos"         : 0,
                    "pedidos_confirmados" : [ ],
                    "pedidos_pendientes"  : [ ],
                    "pedidos_cancelados"  : [ ],
                    "pedidos_total"       : [ ]
                   });
                 }
                 if(
                     this.pedidosArray$[i].status === 4 ||
                     this.pedidosArray$[i].status === 5
                   ){
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].pedidos_confirmados.push(
                       this.pedidosArray$[i]
                     );
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_confirmados =
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_confirmados + this.pedidosArray$[i].total;
                 }
                 if(
                     this.pedidosArray$[i].status === 1 ||
                     this.pedidosArray$[i].status === 2 ||
                     this.pedidosArray$[i].status === 3
                   ){
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].pedidos_pendientes.push(
                       this.pedidosArray$[i]
                     );
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_pendientes =
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_pendientes + this.pedidosArray$[i].total;
                 }
                 if(
                    this.pedidosArray$[i].status === 15
                   ){
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].pedidos_cancelados.push(
                       this.pedidosArray$[i]
                     );
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_cancelados =
                     this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_cancelados + this.pedidosArray$[i].total;
                 }
                 this.pedidosSucursalesArray$[ sucursal_encontrada_index ].pedidos_total.push(
                   this.pedidosArray$[i]
                 );
                 this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_todos =
                 this.pedidosSucursalesArray$[ sucursal_encontrada_index ].total_todos + this.pedidosArray$[i].total;

                 this.pedidosArray$[i].comision = 0;
                 if( this.currentUser$.negocio.comision ){
                   this.pedidosArray$[i].comision = (this.pedidosArray$[i].total*this.currentUser$.negocio.comision)/100;
                 }

                 // Armado de excel
                 this.pedidosArrayExcel$.push({
                   "identificador" : this.pedidosArray$[i]._id,
                   "fecha_alta" : this.pedidosArray$[i].fecha_alta,
                   "sucursal" : this.pedidosArray$[i].negocio.nombre,
                   "cliente" : this.pedidosArray$[i].usuario.nombre,
                   "forma_pago" : this.pedidosArray$[i].forma_pago.descripcion,
                   "total" : this.pedidosArray$[i].total ? this.pedidosArray$[i].total.toFixed(2) : 0,
                   "comision" : this.pedidosArray$[i].comision ? this.pedidosArray$[i].comision.toFixed(2) : 0,
                   "platillos" : this.pedidosArray$[i].platillos.length,
                   "estado" :
                   this.pedidosArray$[i].status === 1 ? "Por confirmar" :
                   this.pedidosArray$[i].status === 2 ? "Preparando tu pedido" :
                   this.pedidosArray$[i].status === 3 ? "Pedido listo" :
                   this.pedidosArray$[i].status === 4 ? "Pedido recogido" :
                   this.pedidosArray$[i].status === 5 ? "Pedido calificado" :
                   this.pedidosArray$[i].status === 10 ? "Por confirmar" :
                   this.pedidosArray$[i].status === 15 ? "Pedido cancelado" :
                   "Desconocido"
                 });
               }

               this.pedidosArrayGrafica$ = this.groupByDates(this.pedidosArray$);

               for( var i = 0; i<this.pedidosArrayGrafica$.length; i++ ){
                 this.pedidosArrayGrafica_Dataset$[0].data.push(
                   this.pedidosArrayGrafica$[i].games.length
                 );
                 this.labels.push(
                   this.pedidosArrayGrafica$[i].date
                 );
               }
               console.log("Pedidos");
               console.log(this.pedidosSucursalesArray$);
             },
             error =>  {
               this.dataService.generalAlert(error);
             }
       );
     }
   }

   exportarProductosXls(): void{
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.mainArray2$);
     const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
     XLSX.writeFile(workbook, "registros.xlsx");
   }

   getProductos(){

     this.mainArray2$ = [];

     this.dataService.useService( "get_platillos_admin" , {  } )
     .subscribe
       (
           (data : any) =>   {

             for( var i = 0; i<data.data.length; i++ ){
               this.mainArray2$.push({
                 "identificador" : data.data[i]._id,
                 "fecha_alta" : data.data[i].fecha_alta,
                 "nombre" : data.data[i].nombre,
                 "descripcion" : data.data[i].descripcion,
                 "costo" : data.data[i].costo,
                 "disponible" : data.data[i].disponible,
                 "categoria" : data.data[i].categoria.nombre,
                 "categoria_identificador" : data.data[i].categoria._id
               });
             }

           },
           error =>  {
             this.dataService.generalAlert(error);
           }
     );

   }

   ngOnInit() {
     //Date filter
     var test_date = new Date();
     this.filtros$.de_fecha = new Date( test_date.getFullYear(), 0, 1 );
     this.filtros$.hasta_fecha = new Date( test_date.getFullYear(), 11, 31 );

     //Inits
     this.currentUser$ = this.authenticationService.currentUserValue;
     console.log(this.currentUser$.negocio);
     this.getPedidos();

   }

}
