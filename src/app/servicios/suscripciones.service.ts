import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Suscripcion } from './../dto/suscripcion-dto';
import { AppSettings } from './../util/app-settings';
import { ResumenCuotasPendientesSuscripciones } from '@dto/resumen-cuotas-pendientes.dto';
import { ResumenEstadosSuscripciones } from '@dto/resumen-estados-suscripciones.dto';
import { ResumenGruposSuscripciones } from '@dto/resumen-grupos-suscripciones.dto';
import { ResumenServiciosSuscripciones } from '@dto/resumen-servicios-suscripciones.dto';
import { ResumenDepartamentosSuscripciones } from '@dto/resumen-departamentos-suscripciones.dto';
import { ResumenDistritosSuscripciones } from '@dto/resumen-distritos-suscripciones.dto';
import { ResumenBarriosSuscripciones } from '@dto/resumen-barrios-suscripciones.dto';
import { ResumenGeneralSuscripciones } from '@dto/resumen-general-suscripciones.dto';

@Injectable({
  providedIn: 'root'
})
export class SuscripcionesService {

  url = `${AppSettings.urlAPI}/suscripciones`;

  constructor(
    private http: HttpClient
  ) { }

  post(s: Suscripcion): Observable<any> {
    return this.http.post(this.url, s, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<Suscripcion[]> {
    return this.http.get<Suscripcion[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Suscripcion> {
    return this.http.get<Suscripcion>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, s: Suscripcion): Observable<any> {
    return this.http.put(`${this.url}/${id}`, s, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getUltimoId(): Observable< number | null> {
    return this.http.get< number | null>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  getResumenCuotasPendientes(params: HttpParams): Observable<ResumenCuotasPendientesSuscripciones[]>{
    return this.http.get<ResumenCuotasPendientesSuscripciones[]>(`${this.url}/resumen/cuotaspendientes`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenCuotasPendientes(params: HttpParams): Observable<number>{
    return this.http.get<number> (`${this.url}/resumen/cuotaspendientes/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenEstados(params: HttpParams): Observable<ResumenEstadosSuscripciones[]>{
    return this.http.get<ResumenEstadosSuscripciones[]>(`${this.url}/resumen/estados`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenEstados(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/resumen/estados/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenGrupos(params: HttpParams): Observable<ResumenGruposSuscripciones[]>{
    return this.http.get<ResumenGruposSuscripciones[]>(`${this.url}/resumen/grupos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
  getTotalResumenGrupos(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/resumen/grupos/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenServicios(params: HttpParams): Observable<ResumenServiciosSuscripciones[]>{
    return this.http.get<ResumenServiciosSuscripciones[]>(`${this.url}/resumen/servicios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenServicios(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/resumen/servicios/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenDepartamentos(params: HttpParams): Observable<ResumenDepartamentosSuscripciones[]>{
    return this.http.get<ResumenDepartamentosSuscripciones[]>(`${this.url}/resumen/departamentos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenDepartamentos(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/resumen/departamentos/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenDistritos(params: HttpParams): Observable<ResumenDistritosSuscripciones[]>{
    return this.http.get<ResumenDistritosSuscripciones[]>(`${this.url}/resumen/distritos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenDistritos(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/resumen/distritos/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenBarrios(params: HttpParams): Observable<ResumenBarriosSuscripciones[]>{
    return this.http.get<ResumenBarriosSuscripciones[]>(`${this.url}/resumen/barrios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenBarrios(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/resumen/barrios/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenGeneral(params: HttpParams): Observable<ResumenGeneralSuscripciones>{
    return this.http.get<ResumenGeneralSuscripciones>(`${this.url}/resumen/general`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  //Estos son los viejos
  /*getResumenGruposServicios(params: HttpParams): Observable<ServerResponseList<ResumenCantMonto>>{
    return this.http.get<ServerResponseList<ResumenCantMonto>>(`${this.url}/resumen/gruposservicios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenDepartamentosDistritos(params: HttpParams): Observable<ServerResponseList<ResumenCantMonto>>{
    return this.http.get<ServerResponseList<ResumenCantMonto>>(`${this.url}/resumen/departamentosdistritos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }*/

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}
