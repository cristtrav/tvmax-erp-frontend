import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from './../dto/servicio-dto';
import { AppSettings } from './../util/app-settings';
import { ServerResponseList } from '../dto/server-response-list.dto';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private url: string = `${AppSettings.urlAPI}/servicios`;
  private urlSusc: string = `${AppSettings.urlAPI}/suscripciones`;

  constructor(private http: HttpClient) { }

  postServicio(srv: Servicio): Observable<any> {
    return this.http.post(this.url, srv, AppSettings.getHttpOptionsJsonTextAuth());
  }

  getServicios(params: HttpParams): Observable<ServerResponseList<Servicio>> {
    return this.http.get<ServerResponseList<Servicio>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalRegistros(filters: Array<{key: string, value: any | null}>): Observable<number>{
    let params = new HttpParams();
    for(let p of filters){
      params = params.append(p.key, p.value);
    }
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getServicioPorId(id: number): Observable<Servicio>{
    return this.http.get<Servicio>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  putServicio(id: number, srv: Servicio): Observable<any> {
    return this.http.put(`${this.url}/${id}`, srv, AppSettings.getHttpOptionsJsonTextAuth());
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsTextAuth())
  }

  getServiciosPorCuotasDeSuscripcion(idsusc: number, params: HttpParams): Observable<ServerResponseList<Servicio>>{
    return this.http.get<ServerResponseList<Servicio>>(`${this.urlSusc}/${idsusc}/cuotas/servicios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}
