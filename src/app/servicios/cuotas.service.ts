import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from './../dto/servicio-dto';
import { AppSettings } from './../util/app-settings';
import { Cuota } from './../dto/cuota-dto';
import { ServerResponseList } from '../dto/server-response-list.dto';
import { CobroCuota } from '@dto/cobro-cuota.dto';


@Injectable({
  providedIn: 'root'
})
export class CuotasService {

  url = `${AppSettings.urlAPI}/cuotas`;
  urlSusc = `${AppSettings.urlAPI}/suscripciones`;

  constructor(
    private http: HttpClient
  ) { }

  /*getServicios(idsus: number): Observable<Servicio[]> {
    const params: HttpParams = new HttpParams().append('idsuscripcion', `${idsus}`);
    return this.http.get<Servicio[]>(`${this.url}/servicios`, { params });
  }*/

  get(filtros: HttpParams): Observable<ServerResponseList<Cuota>> {
    return this.http.get<ServerResponseList<Cuota>>(this.url, AppSettings.getHttpOptionsAuthWithParams(filtros));
  }

  post(c: Cuota): Observable<any>{
    return this.http.post(`${this.url}`, c, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<Cuota>{
    return this.http.get<Cuota>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, c: Cuota): Observable<any>{
    return this.http.put(`${this.url}/${id}`, c, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getCuotasPorSuscripcion(idsusc: number, queryParams: HttpParams): Observable<ServerResponseList<Cuota>>{
    return this.http.get<ServerResponseList<Cuota>>(`${this.urlSusc}/${idsusc}/cuotas`, AppSettings.getHttpOptionsAuth());
  }

  getCobroCuota(idcuota: number): Observable<CobroCuota>{
    return this.http.get<CobroCuota>(`${this.url}/${idcuota}/cobro`, AppSettings.getHttpOptionsAuth());
  }
}
