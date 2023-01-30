import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Domicilio } from '../dto/domicilio-dto';
import { Observable } from 'rxjs';
import { ServerResponseList } from '../dto/server-response-list.dto'; 

@Injectable({
  providedIn: 'root'
})
export class DomiciliosService {

  url = `${AppSettings.urlAPI}/domicilios`;

  constructor(
    private http: HttpClient
  ) { }

  post(d: Domicilio): Observable<any> {
    return this.http.post(this.url, d, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<Domicilio[]> {
    return this.http.get<Domicilio[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Domicilio> {
    return this.http.get<Domicilio>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, d: Domicilio): Observable<any> {
    return this.http.put(`${this.url}/${id}`, d, AppSettings.getHttpOptionsAuth());
  }

  eliminar(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getUltimoId(): Observable<number> {
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }
}
