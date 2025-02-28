import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../utils/app-settings';
import { CuotaDTO } from '../dtos/cuota-dto';
import { CobroCuota } from '@dto/cobro-cuota.dto';
import { environment } from '@environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CuotasService {

  url = `${environment.apiURL}/cuotas`;
  urlSusc = `${environment.apiURL}/suscripciones`;

  constructor(
    private http: HttpClient
  ) { }

  /*getServicios(idsus: number): Observable<Servicio[]> {
    const params: HttpParams = new HttpParams().append('idsuscripcion', `${idsus}`);
    return this.http.get<Servicio[]>(`${this.url}/servicios`, { params });
  }*/

  get(params: HttpParams): Observable<CuotaDTO[]> {
    return this.http.get<CuotaDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalRegistros(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  post(c: CuotaDTO): Observable<any>{
    return this.http.post(`${this.url}`, c, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<CuotaDTO>{
    return this.http.get<CuotaDTO>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, c: CuotaDTO): Observable<any>{
    return this.http.put(`${this.url}/${id}`, c, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getCuotasPorSuscripcion(idsusc: number, params: HttpParams): Observable<CuotaDTO[]>{
    return this.http.get<CuotaDTO[]>(`${this.urlSusc}/${idsusc}/cuotas`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  countCuotasPorSuscripcion(idsusc: number, params: HttpParams): Observable<CuotaDTO[]>{
    return this.http.get<CuotaDTO[]>(`${this.urlSusc}/${idsusc}/cuotas/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getCobroCuota(idcuota: number): Observable<CobroCuota>{
    return this.http.get<CobroCuota>(`${this.url}/${idcuota}/cobro`, AppSettings.getHttpOptionsAuth());
  }

  generarCuotas(mes: number, anio: number): Observable<any>{
    return this.http.post<{mes: number, anio: number}>(`${this.url}/generar`, { mes, anio } ,AppSettings.getHttpOptionsAuth());
  }

  generarCuotasSuscripcion(cuota: CuotaDTO): Observable<RespuestaGeneracionCuotaInterface>{
    return this.http.post<RespuestaGeneracionCuotaInterface>(`${this.url}/generarsuscripcion`, cuota, AppSettings.getHttpOptionsAuth());
  }
}

export interface RespuestaGeneracionCuotaInterface {
  total: number;
  generado: number;
  errors: string[];
}
