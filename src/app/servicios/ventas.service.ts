import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleFacturaVenta } from '@dto/detalle-factura-venta-dto';
import { FacturaVenta } from '@dto/factura-venta.dto';
import { ResumenCantMonto } from '@dto/resumen-cant-monto-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  url: string = `${AppSettings.urlAPI}/ventas`;

  constructor(
    private http: HttpClient
  ) { }

  post(fv: FacturaVenta): Observable<number>{
    return this.http.post<number>(this.url, fv, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<ServerResponseList<FacturaVenta>>{
    return this.http.get<ServerResponseList<FacturaVenta>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
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

  getPorId(id: number): Observable<FacturaVenta>{
    return this.http.get<FacturaVenta>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
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

  getDetallePorIdVenta(idventa: number): Observable<ServerResponseList<DetalleFacturaVenta>>{
    return this.http.get<ServerResponseList<DetalleFacturaVenta>>(`${this.url}/${idventa}/detalles`, AppSettings.getHttpOptionsAuth());
  }
}
