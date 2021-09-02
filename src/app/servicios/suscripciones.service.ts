import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Suscripcion } from './../dto/suscripcion-dto';
import { AppSettings } from './../util/app-settings';
import { ServerResponseList } from '../dto/server-response-list.dto';

@Injectable({
  providedIn: 'root'
})
export class SuscripcionesService {

  url = `${AppSettings.urlAPI}/suscripciones`;

  constructor(
    private http: HttpClient
  ) { }

  post(s: Suscripcion): Observable<any> {
    return this.http.post(this.url, s, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<ServerResponseList<Suscripcion>> {
    return this.http.get<ServerResponseList<Suscripcion>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Suscripcion> {
    return this.http.get<Suscripcion>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, s: Suscripcion): Observable<any> {
    return this.http.put(`${this.url}/${id}`, s, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getUltimoId(): Observable< number | null> {
    return this.http.get< number | null>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }
}
