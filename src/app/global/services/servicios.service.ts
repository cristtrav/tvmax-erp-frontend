import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../dtos/servicio-dto';
import { AppSettings } from '../utils/app-settings';
import { environment } from '@environments/environment';
import { CuotaGrupoDTO } from '@dto/cuota-grupo.dto';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private url: string = `${environment.apiURL}/servicios`;
  private urlSusc: string = `${environment.apiURL}/suscripciones`;

  constructor(private http: HttpClient) { }

  postServicio(srv: Servicio): Observable<any> {
    return this.http.post(this.url, srv, AppSettings.getHttpOptionsJsonTextAuth());
  }

  getServicios(params: HttpParams): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalRegistros(params: HttpParams): Observable<number>{
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

  getServiciosPorCuotasDeSuscripcion(idsusc: number, params: HttpParams): Observable<Servicio[]>{
    return this.http.get<Servicio[]>(`${this.urlSusc}/${idsusc}/cuotas/servicios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  countServiciosPorCuotasDeSuscripcion(idsusc: number, params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.urlSusc}/${idsusc}/cuotas/servicios/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getLastId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }
}
