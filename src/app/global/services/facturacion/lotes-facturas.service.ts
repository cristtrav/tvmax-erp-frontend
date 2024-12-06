import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoteFacturaDTO } from '@dto/facturacion/lote-factura.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LotesFacturasService {

  private readonly url = `${environment.apiURL}/lotesfacturas`;

  constructor(
    private httpUtilsSrv: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<LoteFacturaDTO[]>{
    return this.httpUtilsSrv.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.httpUtilsSrv.get(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  enviarLote(id: number): Observable<any>{
    return this.httpUtilsSrv.get(`${this.url}/enviar/${id}`, AppSettings.getHttpOptionsAuth());
  }

  consultarLote(id: number): Observable<any>{
    return this.httpUtilsSrv.get(`${this.url}/consultar/${id}`, AppSettings.getHttpOptionsAuth());
  }

  generarLotes(): Observable<any>{
    return this.httpUtilsSrv.get(`${this.url}/generar`, AppSettings.getHttpOptionsAuth());
  }
}
