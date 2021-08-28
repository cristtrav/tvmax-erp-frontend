import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cobrador } from '../dto/cobrador-dto';
import { Observable } from 'rxjs';
import { ServerResponseList } from '../dto/server-response-list.dto';

@Injectable({
  providedIn: 'root'
})
export class CobradoresService {

  url = `${AppSettings.urlAPI}/cobradores`;

  constructor(
    private http: HttpClient
  ) { }

  post(c: Cobrador): Observable<any> {
    return this.http.post(this.url, c, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<Cobrador> {
    return this.http.get<Cobrador>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, c: Cobrador): Observable<any> {
    return this.http.put(`${this.url}/${id}`, c, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<ServerResponseList<Cobrador>> {
    return this.http.get<ServerResponseList<Cobrador>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
