import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Barrio } from '../dto/barrio-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarriosService {

  url: string = `${AppSettings.urlAPI}/barrios`;

  constructor(
    private http: HttpClient
  ) { }

  post(b: Barrio): Observable<any>{
    return this.http.post(this.url, b, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<Barrio[]> {
    return this.http.get<Barrio[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Barrio>{
    return this.http.get<Barrio>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, b: Barrio): Observable<any> {
    return this.http.put(`${this.url}/${id}`, b, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getTotalRegistros(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getLastId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

}
