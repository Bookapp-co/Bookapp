import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, RouterStateSnapshot } from '@angular/router';
import { DataService } from '../data.service';
import { map } from 'rxjs/operators';

import { User } from '../_models/user.model';
import { Pedido } from '../_models/pedido.model';

import { Socket } from 'ngx-socket-io';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    public currentMenuIndex: Observable<number>;
    private currentMenuIndexSubject: BehaviorSubject<number>;

    public currentPedido = new Pedido();
    public registration_id = "";

    @Output() getHeaderTitle: EventEmitter<any> = new EventEmitter();
    @Output() getUbicacion: EventEmitter<any>   = new EventEmitter();

    constructor( private socket: Socket, private dataService : DataService, private router: Router, private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser_VieneViene5')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentMenuIndexSubject = new BehaviorSubject<number>(1);
        this.currentMenuIndex = this.currentMenuIndexSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentPedidoValue(): Pedido {
        return this.currentPedido;
    }

    setCurrentMenuIndex( index_t ){
      console.log("setCurrentMenuIndex", index_t);
      this.currentMenuIndex = index_t;
      this.currentMenuIndexSubject.next(index_t);
    }

    public get getCurrentMenuIndex(): number{
      return this.currentMenuIndexSubject.value;
    }

    setPedido( pedido_t ){
      this.currentPedido = pedido_t;
    }

    getPedido( ){
      return this.currentPedido;
    }

    clearPedido(){
      this.currentPedido = new Pedido();
    }

    changeHeaderTitle(titulo_t){
      this.getHeaderTitle.emit(titulo_t);
    }

    changeUserInfo(user){
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser_VieneViene5', JSON.stringify(user));
      this.getUbicacion.emit("sinvalor");
    }

    setRegistrationID( reg_t ){
      this.registration_id = reg_t;
       // this.currentPedidoSubject.next(pedido_t);
    }

    getRegistrationID(){
      return this.registration_id;
    }

    watchUserPosition(user){
      if(user){
        if(user.tipo_usuario_id === '5c40513258209844a83c8629' || user.tipo_usuario_id === '5c40513658209844a83c862a'){
          if ("geolocation" in navigator) {
            const opts = { enableHighAccuracy: true, maximumAge: 60000, timeout: 30000 };
            navigator.geolocation.watchPosition((position) => {
              const ubicacion_t = {
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
              }
              this.dataService.useService("actualizar_ubicacion_pedidos", { usuario: user, ubicacion : ubicacion_t })
                  .subscribe(function (data) {
              }, function (error) {
              });
            },
            (err) => {
              console.log(err);
            },
            opts);
          }
        }
      }
    }

    setUser(user){

      if(user){

        this.currentUser = user;
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser_VieneViene5', JSON.stringify(user));

        this.socket.emit('join', user);

        if( this.registration_id != "" ){
          this.dataService.useService("actualizar_registration_id", { data: { "_id" : user._id, "registrationId" : this.registration_id } })
              .subscribe(function (data) {
          }, function (error) {
          });
        }

        switch( user.tipo_usuario_id ){
          //Admin App
          case "5c4050f358209844a83c8622":
            this.router.navigate(['pedidos/admin'], {  });
          break;
          //Admin Neg
          case "5c4050fa58209844a83c8623":
            this.router.navigate(['pedidos/admin'], {  });
          break;
          //Repartidor
          case "5c40513658209844a83c862a":
            this.router.navigate(['pedidos/admin'], {  });
          break;
          //Cliente
          case "5c40513258209844a83c8629":
            this.router.navigate(['cliente/seleccion-categoria'], {  });
          break;
          //Restaurante
          case "5e30cadaec6ea3c622235f99":
            this.router.navigate(['pedidos/listado'], {  });
          break;
          //Station
          case "5e30cae5ec6ea3c622235f9b":
            this.router.navigate(['pedidos/listado'], {  });
          break;
        }

      }else{

        this.router.navigate(['pages/login'], {  });
		// this.router.navigate(['cliente/seleccion-categoria'], {  });

      }

    }

    setUserNoRedirect(user){

      if(user){

        this.currentUser = user;
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser_VieneViene5', JSON.stringify(user));

      }else{

        this.router.navigate(['pages/login'], {  });

      }

    }

    redireccionarUsuario(user){

      if(user){

        switch( user.tipo_usuario_id ){
          //Admin App
          case "5c4050f358209844a83c8622":
            this.router.navigate(['pedidos/admin'], {  });
          break;
          //Admin Neg
          case "5c4050fa58209844a83c8623":
            this.router.navigate(['pedidos/admin'], {  });
          break;
          //Repartidor
          case "5c40513658209844a83c862a":
            this.router.navigate(['pedidos/admin'], {  });
          break;
          //Cliente
          case "5c40513258209844a83c8629":
            this.router.navigate(['cliente/seleccion-categoria'], {  });
          break;
          //Restaurante
          case "5e30cadaec6ea3c622235f99":
            this.router.navigate(['pedidos/listado'], {  });
          break;
          //Station
          case "5e30cae5ec6ea3c622235f9b":
            this.router.navigate(['pedidos/listado'], {  });
          break;
        }

      }else{

        this.router.navigate(['pages/login'], {  });
		// this.router.navigate(['cliente/seleccion-categoria'], {  });

      }

    }

    login(username: string, password: string) {
        return this.http.post<any>('https://codigeek.app/orlandoadmin/autenticacion', { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser_VieneViene5', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.socket.emit('join', user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser_VieneViene5');
        this.currentUserSubject.next(null);
        this.router.navigate(['pages/login'], {  });
    }
}
