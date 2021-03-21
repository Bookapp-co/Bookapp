import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Module } from './module.model';
import Swal from 'sweetalert2'
import { Router, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  apiURL = "https://codigeek.app/bookapp/";
  private modalData = new Subject<any>();

  constructor( private socket: Socket, private router: Router, private _http : HttpClient) { }

  public onMessage(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('actualizar_pedido', (data: any) => observer.next(data));
      });
  }

  public getPedidosPendientes(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('actualizar_pedidos_pendientes', (data: any) => observer.next(data));
      });
  }

  ejecutarModal(data_t) {
      this.modalData.next(data_t);
  }

  getModalData(): Observable<any> {
      return this.modalData.asObservable();
  }

  public getPedidosUbicacion(): Observable<any> {
      return new Observable<any>(observer => {
          this.socket.on('actualizar_pedidos_ubicacion', (data: any) => observer.next(data));
      });
  }

  guardarArchivo( file ){

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };

      console.log("Antes de enviar");
      console.log(file);

      // var fd = new FormData();
      // fd.append('file', file);
      // fd.append('name', name);

      let fd = new FormData();
      fd.append("file", file, file.name);

      console.log(fd);

      var test_t = this._http.post( this.apiURL + "guardar_documento", fd)
      .subscribe((response) => {
          console.log('response received is ', response);
      })
  }

  generalAlert( payload$ ){
    (Swal as any).fire({
      type: payload$.status,
      title: payload$.message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    })
  }

  useService( url, payload$ ){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      var test_t = this._http.post(this.apiURL+url, payload$, httpOptions);
      return test_t;
  }

  autenticacion(usuarioP){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      var test_t = this._http.post(this.apiURL+"autenticacion", { data : usuarioP }, httpOptions);
      return test_t;
  }

  getModules(){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      var test_t = this._http.post(this.apiURL+"get_modules_tree", [], httpOptions);
      return test_t;
  }

  getUsuarios(){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      var test_t = this._http.post(this.apiURL+"get_usuarios", [], httpOptions);
      return test_t;
  }

  getAccesos(){
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      var test_t = this._http.post(this.apiURL+"get_accesos", [], httpOptions);
      return test_t;
  }

}
