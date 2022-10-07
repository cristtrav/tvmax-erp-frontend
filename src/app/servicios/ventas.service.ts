import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { Venta } from '@dto/venta.dto';
import { ResumenCantMonto } from '@dto/resumen-cant-monto-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';
import { DetalleVentaCobro } from '@dto/detalle-venta-cobro.dto';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  url: string = `${AppSettings.urlAPI}/ventas`;

  constructor(
    private http: HttpClient
  ) { }

  post(fv: Venta): Observable<number>{
    return this.http.post<number>(this.url, fv, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<ServerResponseList<Venta>>{
    return this.http.get<ServerResponseList<Venta>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  anular(idventa: number): Observable<any>{
    return this.http.get(`${this.url}/${idventa}/anular`, AppSettings.getHttpOptionsAuth());
  }

  revertiranul(idventa: number): Observable<any>{
    return this.http.get(`${this.url}/${idventa}/revertiranulacion`, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<Venta>{
    return this.http.get<Venta>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getResumenGruposServicios(params: HttpParams): Observable<ServerResponseList<ResumenCantMonto>>{
    return this.http.get<ServerResponseList<ResumenCantMonto>>(`${this.url}/resumen/gruposservicios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getResumenCobradores(params: HttpParams): Observable<ServerResponseList<ResumenCantMonto>>{
    return this.http.get<ServerResponseList<ResumenCantMonto>>(`${this.url}/resumen/cobradores`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  count(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/count`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getMontoTotal(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/resumen/montototal`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getDetallePorIdVenta(idventa: number): Observable<ServerResponseList<DetalleVenta>>{
    return this.http.get<ServerResponseList<DetalleVenta>>(`${this.url}/${idventa}/detalles`, AppSettings.getHttpOptionsAuth());
  }

  getDetallesVentaCobros(params: HttpParams): Observable<ServerResponseList<DetalleVentaCobro>>{
    return this.http.get<ServerResponseList<DetalleVentaCobro>>(`${this.url}/detalles/cobros`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}
