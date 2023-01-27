import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cliente } from '../dto/cliente-dto';
import { Observable } from 'rxjs';
import { ServerResponseList } from '../dto/server-response-list.dto';
import { Suscripcion } from '@dto/suscripcion-dto';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  url = `${AppSettings.urlAPI}/clientes`;

  constructor(
    private http: HttpClient
  ) { }

  post(c: Cliente): Observable<any> {
    return this.http.post(this.url, c, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, c: Cliente): Observable<any> {
    return this.http.put(`${this.url}/${id}`, c, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getUltimoId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getSuscripcionesPorCliente(idcliente: number,params: HttpParams): Observable<ServerResponseList<Suscripcion>>{
    return this.http.get<ServerResponseList<Suscripcion>>(`${this.url}/${idcliente}/suscripciones`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}