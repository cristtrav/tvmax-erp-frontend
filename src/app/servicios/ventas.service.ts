import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FacturaVenta } from '@dto/factura-venta.dto';
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
}
