import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstadoFacturaElectronicaDTO } from '@dto/facturacion/estado-factura-electronica.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoFacturaElectronicaService {

  private readonly url = `${environment.apiURL}/estadosfacturaselectronicas`;

  constructor(
    private httpsUtil: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<EstadoFacturaElectronicaDTO[]>{
    return this.httpsUtil.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.httpsUtil.get(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

}
