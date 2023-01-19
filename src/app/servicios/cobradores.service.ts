import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponseList } from '../dto/server-response-list.dto';
import { Usuario } from '@dto/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class CobradoresService {

  url = `${AppSettings.urlAPI}/cobradores`;

  constructor(
    private http: HttpClient
  ) { }

  post(c: Usuario): Observable<any> {
    return this.http.post(this.url, c, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, c: Usuario): Observable<any> {
    return this.http.put(`${this.url}/${id}`, c, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<ServerResponseList<Usuario>> {
    return this.http.get<ServerResponseList<Usuario>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
