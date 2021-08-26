import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TipoDomicilio } from '../dto/tipodomicilio-dto';
import { Observable } from 'rxjs';
import { ServerResponseList } from '../dto/server-response-list.dto';

@Injectable({
  providedIn: 'root'
})
export class TiposdomiciliosService {

  url = `${AppSettings.urlAPI}/tiposdomicilios`;

  constructor(
    private http: HttpClient
  ) { }

  post(td: TipoDomicilio): Observable<any>{
    return this.http.post(this.url, td, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<TipoDomicilio> {
    return this.http.get<TipoDomicilio>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, td: TipoDomicilio): Observable<any>{
    return this.http.put(`${this.url}/${id}`, td, AppSettings.getHttpOptionsAuth());
  }

  get(p: HttpParams): Observable<ServerResponseList<TipoDomicilio>> {
    return this.http.get<ServerResponseList<TipoDomicilio>>(this.url, AppSettings.getHttpOptionsAuthWithParams(p));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getTotalRegistros(p: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(p));
  }
}
