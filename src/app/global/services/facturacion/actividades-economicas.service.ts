import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActividadEconomicaDTO } from '@dto/facturacion/actividad-economica.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadesEconomicasService {

  readonly url = `${environment.apiURL}/actividadeseconomicas`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<ActividadEconomicaDTO[]>{
    return this.httpUtils.get(`${this.url}`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getById(id: string): Observable<ActividadEconomicaDTO>{
    return this.httpUtils.get(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  post(actividad: ActividadEconomicaDTO): Observable<any>{
    return this.httpUtils.post(this.url, actividad, AppSettings.getHttpOptionsAuth());
  }

  put(id: string, actividad: ActividadEconomicaDTO): Observable<any>{
    return this.httpUtils.put(`${this.url}/${id}`, actividad, AppSettings.getHttpOptionsAuth());
  }

  delete(id: string): Observable<any>{
    return this.httpUtils.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
