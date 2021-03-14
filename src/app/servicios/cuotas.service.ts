import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from './../dto/servicio-dto';
import { AppSettings } from './../util/app-settings';
import { Cuota } from './../dto/cuota-dto';

@Injectable({
  providedIn: 'root'
})
export class CuotasService {

  url = `${AppSettings.urlAPI}/cuotas`;

  constructor(
    private http: HttpClient
  ) { }

  getServicios(idsus: number): Observable<Servicio[]> {
    const params: HttpParams = new HttpParams().append('idsuscripcion', `${idsus}`);
    return this.http.get<Servicio[]>(`${this.url}/servicios`, { params });
  }

  get(filtros: Array<{ key: string, value: any | null }>): Observable<Cuota[]> {
    let params: HttpParams = new HttpParams()
      .append('eliminado', 'false');
    for (let f of filtros) {
      params = params.append(f.key, `${f.value}`);
    }
    return this.http.get<Cuota[]>(this.url, { params });
  }

  post(c: Cuota): Observable<any>{
    return this.http.post(`${this.url}`, c, AppSettings.httpOptionsPost);
  }

  getPorId(id: number): Observable<Cuota>{
    return this.http.get<Cuota>(`${this.url}/${id}`);
  }

  put(id: number, c: Cuota): Observable<any>{
    return this.http.put(`${this.url}/${id}`, c, AppSettings.httpOptionsPost);
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text'});
  }
}
