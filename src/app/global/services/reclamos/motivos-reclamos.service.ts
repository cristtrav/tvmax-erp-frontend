import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MotivoReclamoDTO } from 'src/app/global/dtos/reclamos/motivo-reclamo.dto';
import { HttpUtilsService } from 'src/app/global/services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotivosReclamosService {

  readonly url = `${environment.apiURL}/motivosreclamos`

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<MotivoReclamoDTO[]>{
    return this.httpUtils.get<MotivoReclamoDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params))
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.httpUtils.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params))
  }

  post(motivo: MotivoReclamoDTO): Observable<any>{
    return this.httpUtils.post(this.url, motivo, AppSettings.getHttpOptionsAuth())
  }

  put(oldId: number, motivo: MotivoReclamoDTO): Observable<any>{
      return this.httpUtils.put(`${this.url}/${oldId}`, motivo, AppSettings.getHttpOptionsAuth())
  }

  delete(id: number): Observable<any>{
    return this.httpUtils.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());  
  }

  getPorId(id: number): Observable<any>{
    return this.httpUtils.get(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getLastId(): Observable<number>{
    return this.httpUtils.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }
  
}
