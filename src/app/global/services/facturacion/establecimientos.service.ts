import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstablecimientoDTO } from '@dto/facturacion/establecimiento.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientosService {

  readonly url = `${environment.apiURL}/establecimientos`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<EstablecimientoDTO[]>{
    return this.httpUtils.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }
  
  getById(id: number): Observable<EstablecimientoDTO>{
    return this.httpUtils.get(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  count(params: HttpParams): Observable<number>{
    return this.httpUtils.get(`${this.url}/count`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  post(establecimiento: EstablecimientoDTO): Observable<any>{
    return this.httpUtils.post(this.url, establecimiento, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, establecimiento: EstablecimientoDTO): Observable<any>{
    return this.httpUtils.put(`${this.url}/${id}`, establecimiento, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.httpUtils.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

}
