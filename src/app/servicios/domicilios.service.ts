import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Domicilio } from '../dto/domicilio-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DomiciliosService {

  url = `${AppSettings.urlAPI}/domicilios`;

  constructor(
    private http: HttpClient
  ) { }

  post(d: Domicilio): Observable<any> {
    return this.http.post(this.url, d, AppSettings.httpOptionsPost);
  }

  get(filters: Array<{ key: string, value: any | null }>): Observable<any> {
    let params = new HttpParams()
      .append('eliminado', 'false')
      .append('sort', '+id');
    for (let f of filters) {
      params = params.append(f.key, f.value);
    }
    return this.http.get(this.url, { params });
  }

  getPorId(id: number): Observable<Domicilio> {
    return this.http.get<Domicilio>(`${this.url}/${id}`);
  }

  put(id: number, d: Domicilio): Observable<any> {
    return this.http.put(`${this.url}/${id}`, d, AppSettings.httpOptionsPost);
  }

  eliminar(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }

  getUltimoId(): Observable<{ultimoid: number | null}> {
    return this.http.get<{ultimoid: number | null}>(`${this.url}/ultimoid`);
  }
}
