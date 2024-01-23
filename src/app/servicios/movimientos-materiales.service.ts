import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetalleMovimientoMaterialDTO } from '@dto/detalle-movimiento-material.dto';
import { MovimientoMaterialDTO } from '@dto/movimiento-material.dto';
import { environment } from '@environments/environment';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovimientosMaterialesService {

  private url: string = `${environment.apiURL}/movimientosmateriales`;

  constructor(
    private http: HttpClient
  ) { }

  post(movimiento: MovimientoMaterialDTO): Observable<number>{
    return this.http.post<number>(this.url, movimiento, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<MovimientoMaterialDTO[]>{
    return this.http.get<MovimientoMaterialDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(idmovimiento: number): Observable<MovimientoMaterialDTO>{
    return this.http.get<MovimientoMaterialDTO>(`${this.url}/${idmovimiento}`, AppSettings.getHttpOptionsAuth());
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getDetallesPorIdMovimiento(id: number, params?: HttpParams): Observable<DetalleMovimientoMaterialDTO[]>{
    return this.http.get<DetalleMovimientoMaterialDTO[]>(
      `${this.url}/${id}/detalles`,
      params ? AppSettings.getHttpOptionsAuthWithParams(params) : AppSettings.getHttpOptionsAuth()
    );
  }

  delete(idmovimiento: number): Observable<any> {
    return this.http.delete(`${this.url}/${idmovimiento}`, AppSettings.getHttpOptionsAuth());
  }

  getLastId(params?: HttpParams): Observable<number>{
    if(params) return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuthWithParams(params));
    else return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  put(movimiento: MovimientoMaterialDTO): Observable<any>{
    return this.http.put(this.url, movimiento, AppSettings.getHttpOptionsAuth());
  }
}
