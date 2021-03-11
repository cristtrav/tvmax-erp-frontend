import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Suscripcion } from './../dto/suscripcion-dto';
import { AppSettings } from './../util/app-settings';

@Injectable({
  providedIn: 'root'
})
export class SuscripcionesService {

  url = `${AppSettings.urlAPI}/suscripciones`;

  constructor(
    private http: HttpClient
  ) { }

  post(s: Suscripcion): Observable<any> {
    return this.http.post(this.url, s, AppSettings.httpOptionsPost);
  }

  get(filters: Array<{ key: string, value: any | null }>): Observable<Suscripcion[]> {
    let params = new HttpParams()
      .append('eliminado', 'false')
      .append('sort', '+id');
    for (let f of filters) {
      params = params.append(f.key, f.value);
    }
    return this.http.get<Suscripcion[]>(this.url, { params });
  }

  getPorId(id: number): Observable<Suscripcion> {
    return this.http.get<Suscripcion>(`${this.url}/${id}`);
  }

  put(id: number, s: Suscripcion): Observable<any> {
    return this.http.put(`${this.url}/${id}`, s, AppSettings.httpOptionsPost);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }
}
