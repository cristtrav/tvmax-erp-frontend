import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CobroDetalleVenta } from '@dto/cobro-detalle-venta.dto';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CobrosService {

  readonly url: string = `${AppSettings.urlAPI}/cobros`;

  constructor(
    private http: HttpClient
  ) { }

  getCobrosDetalles(params: HttpParams): Observable<CobroDetalleVenta[]>{
    return this.http.get<CobroDetalleVenta[]>(`${this.url}/detalles`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalCobrosDetalles(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/detalles/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}
