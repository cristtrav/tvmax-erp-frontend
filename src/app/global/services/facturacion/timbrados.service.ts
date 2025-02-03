import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimbradoDTO } from '@dto/facturacion/timbrado.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimbradosService {

  readonly url = `${environment.apiURL}/timbrados`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<TimbradoDTO[]>{
    return this.httpUtils.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getByNroTimbrado(nrotimbrado: number): Observable<TimbradoDTO>{
    return this.httpUtils.get(`${this.url}/${nrotimbrado}`, AppSettings.getHttpOptionsAuth());
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.httpUtils.get(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  post(timbrado: TimbradoDTO): Observable<any>{
    return this.httpUtils.post(this.url, timbrado, AppSettings.getHttpOptionsAuth());
  }

  put(nrotimbrado: number, timbrado: TimbradoDTO): Observable<any>{
    return this.httpUtils.put(`${this.url}/${nrotimbrado}`, timbrado, AppSettings.getHttpOptionsAuth());
  }

  delete(nrotimbrado: number): Observable<any>{
    return this.httpUtils.delete(`${this.url}/${nrotimbrado}`, AppSettings.getHttpOptionsAuth());
  }
}
