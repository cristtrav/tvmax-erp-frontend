import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Timbrado } from '../dto/timbrado.dto';
import { AppSettings } from './../util/app-settings';
import { HttpClient } from '@angular/common/http';

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

  get(params: HttpParams): Observable<Timbrado[]>{
    return this.http.get<Timbrado[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Timbrado> {
    return this.http.get<Timbrado>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getUltimoId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, t: Timbrado): Observable<any>{
    return this.http.put(`${this.url}/${id}`, t,AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
