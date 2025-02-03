import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DteDTO } from '@dto/facturacion/factura-electronica.dto';
import { NotaCreditoDetalleDTO } from '@dto/facturacion/nota-credito-detalle.dto';
import { NotaCreditoDTO } from '@dto/facturacion/nota-credito.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotasCreditoService {

  private url: string = `${environment.apiURL}/notascredito`

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  NotaCreditoElectronica(params: HttpParams): Observable<NotaCreditoDTO[]>{
    return this.httpUtils.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  count(params: HttpParams): Observable<number>{
    return this.httpUtils.get(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getDetallesPorIdNota(idnota: number): Observable<NotaCreditoDetalleDTO[]>{
    return this.httpUtils.get(`${this.url}/${idnota}/detalles`, AppSettings.getHttpOptionsAuth());
  }

  getDteXml(idnota: number): Observable<any>{
    return this.httpUtils.get(`${this.url}/${idnota}/dte-xml`, AppSettings.getHttpOptionsBlobAuth());
  }

  getKUDE(idnota: number, duplicado: boolean = false): Observable<any>{
    const params = new HttpParams().append('duplicado', duplicado);
    return this.httpUtils.get(`${this.url}/${idnota}/kude`, AppSettings.getHttpOptionsBlobAuthWithParams(params));
  }

  getDTE(idnota: number): Observable<DteDTO>{
    return this.httpUtils.get<DteDTO>(`${this.url}/${idnota}/dte`, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.httpUtils.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  cancelar(idnota: number): Observable<any>{
    return this.httpUtils.post(`${this.url}/${idnota}/cancelar`, null, AppSettings.getHttpOptionsAuth());
  }
}
