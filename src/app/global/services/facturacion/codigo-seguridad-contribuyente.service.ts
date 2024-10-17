import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodigoSeguridadContribuyenteDTO } from '@dto/facturacion/codigo-seguridad-contribuyente.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodigoSeguridadContribuyenteService {

  readonly url = `${environment.apiURL}/csc`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<CodigoSeguridadContribuyenteDTO[]>{
    return this.httpUtils.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  count(params: HttpParams): Observable<number>{
    return this.httpUtils.get(`${this.url}/count`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getById(id: number): Observable<CodigoSeguridadContribuyenteDTO>{
    return this.httpUtils.get(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  post(csc: CodigoSeguridadContribuyenteDTO): Observable<any>{
    return this.httpUtils.post(this.url, csc, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, csc: CodigoSeguridadContribuyenteDTO): Observable<any>{
    return this.httpUtils.put(`${this.url}/${id}`, csc, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.httpUtils.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

}
