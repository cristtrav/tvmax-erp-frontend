import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AjusteExistenciaDTO } from '@dto/depositos/ajuste-existencia.dto';
import { AjusteMaterialIdentificableDTO } from '@dto/depositos/ajuste-material-identificable.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AjustesExistenciasService {

  private url: string = `${environment.apiURL}/ajustesexistencias`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<AjusteExistenciaDTO[]>{
    return this.httpUtils.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.httpUtils.get(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getById(id: number): Observable<AjusteExistenciaDTO>{
    return this.httpUtils.get(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  post(ajusteExistencia: AjusteExistenciaDTO): Observable<number>{
    return this.httpUtils.post(this.url, ajusteExistencia, AppSettings.getHttpOptionsAuth());
  }

  put(idajuste: number, ajusteExistencia: AjusteExistenciaDTO): Observable<any>{
    return this.httpUtils.put(`${this.url}/${idajuste}`, ajusteExistencia, AppSettings.getHttpOptionsAuth());
  }

  delete(idajuste: number): Observable<any>{
    return this.httpUtils.delete(`${this.url}/${idajuste}`, AppSettings.getHttpOptionsAuth());
  }

  getAjustesIdentificables(params: HttpParams): Observable<AjusteMaterialIdentificableDTO[]>{
    return this.httpUtils.get(`${this.url}/identificables`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
  
}
