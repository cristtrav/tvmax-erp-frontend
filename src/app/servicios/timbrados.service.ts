import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Timbrado } from '../dto/timbrado.dto';
import { AppSettings } from './../util/app-settings';
import { HttpClient } from '@angular/common/http';
import { ServerResponseList } from '@dto/server-response-list.dto';

@Injectable({
  providedIn: 'root'
})
export class TimbradosService {

  private url: string = `${AppSettings.urlAPI}/timbrados`

  constructor(
    private http: HttpClient
  ) { }

  post(t: Timbrado): Observable<any> {
    return this.http.post(this.url, t, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<ServerResponseList<Timbrado>>{
    return this.http.get<ServerResponseList<Timbrado>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Timbrado> {
    return this.http.get<Timbrado>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, t: Timbrado): Observable<any>{
    return this.http.put(`${this.url}/${id}`, t,AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
