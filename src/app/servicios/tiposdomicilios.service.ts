import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient } from '@angular/common/http';
import { TipoDomicilio } from '../dto/tipodomicilio-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposdomiciliosService {

  url = `${AppSettings.urlAPI}/tiposdomicilios`;

  constructor(
    private http: HttpClient
  ) { }

  post(td: TipoDomicilio): Observable<any>{
    return this.http.post(this.url, td, AppSettings.httpOptionsPost);
  }

  getPorId(id: number): Observable<TipoDomicilio> {
    return this.http.get<TipoDomicilio>(`${this.url}/${id}`);
  }

  put(id: number, td: TipoDomicilio): Observable<any>{
    return this.http.put(`${this.url}/${id}`, td, AppSettings.httpOptionsPost);
  }

  get(): Observable<TipoDomicilio[]> {
    return this.http.get<TipoDomicilio[]>(this.url);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }
}
