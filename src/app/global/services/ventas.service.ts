import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { Venta } from '@dto/venta.dto';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';
import { ResumenGruposVentas } from '@dto/resumen-grupos-ventas.dto';
import { ResumenServiciosVentas } from '@dto/resumen-servicios-ventas.dto';
import { ResumenCobradoresVentas } from '@dto/resumen-cobradores-ventas.dto';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  url: string = `${environment.apiURL}/ventas`;

  constructor(
    private http: HttpClient
  ) { }

  post(fv: Venta): Observable<number> {
    return this.http.post<number>(this.url, fv, AppSettings.getHttpOptionsAuth());
  }

  put(fv: Venta): Observable<any> {
    return this.http.put(this.url, fv, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  anular(idventa: number): Observable<any> {
    return this.http.get(`${this.url}/${idventa}/anular`, AppSettings.getHttpOptionsAuth());
  }

  revertiranul(idventa: number): Observable<any> {
    return this.http.get(`${this.url}/${idventa}/revertiranulacion`, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getResumenGrupos(params: HttpParams): Observable<ResumenGruposVentas[]> {
    return this.http.get<ResumenGruposVentas[]>(`${this.url}/resumen/grupos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenGrupos(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/resumen/grupos/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenServicios(params: HttpParams): Observable<ResumenServiciosVentas[]> {
    return this.http.get<ResumenServiciosVentas[]>(`${this.url}/resumen/servicios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenServicios(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/resumen/servicios/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  /*getResumenGruposServicios(params: HttpParams): Observable<ServerResponseList<ResumenCantMonto>>{
    return this.http.get<ServerResponseList<ResumenCantMonto>>(`${this.url}/resumen/gruposservicios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }*/

  getResumenCobradores(params: HttpParams): Observable<ResumenCobradoresVentas[]> {
    return this.http.get<ResumenCobradoresVentas[]>(`${this.url}/resumen/cobradores`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalResumenCobradores(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/resumen/cobradores/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  count(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/count`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getMontoTotal(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/resumen/monto`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getDetallePorIdVenta(idventa: number, params?: HttpParams): Observable<DetalleVenta[]> {
    if(params) return this.http.get<DetalleVenta[]>(`${this.url}/${idventa}/detalles`, AppSettings.getHttpOptionsAuthWithParams(params));
    else return this.http.get<DetalleVenta[]>(`${this.url}/${idventa}/detalles`, AppSettings.getHttpOptionsAuth());
  }

  getTotalDetallesPorIdVenta(idventa: number): Observable<number> {
    return this.http.get<number>(`${this.url}/detalles/total`, AppSettings.getHttpOptionsAuth());
  }

  /*getDetallesVentaCobros(params: HttpParams): Observable<ServerResponseList<DetalleVentaCobro>>{
    return this.http.get<ServerResponseList<DetalleVentaCobro>>(`${this.url}/detalles/cobros`, AppSettings.getHttpOptionsAuthWithParams(params));
  }*/
}
