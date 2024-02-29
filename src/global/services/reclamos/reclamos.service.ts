import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DetalleReclamoDTO } from '@global-dtos/reclamos/detalle-reclamo.dto';
import { ReclamoDTO } from '@global-dtos/reclamos/reclamo.dto';
import { HttpUtilsService } from '@global-services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamosService {

  private readonly url: string = `${environment.apiURL}/reclamos`

  constructor(
    private httpUtilSrv: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<ReclamoDTO[]>{
    return this.httpUtilSrv.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.httpUtilSrv.get(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  post(reclamo: ReclamoDTO): Observable<number>{
    return this.httpUtilSrv.post<number>(this.url, reclamo, AppSettings.getHttpOptionsTextAuth());
  }

  put(oldId: number, reclamo: ReclamoDTO): Observable<any>{
    return this.httpUtilSrv.put(`${this.url}/${oldId}`, reclamo, AppSettings.getHttpOptionsAuth());
  }

  getDetallesByReclamo(idreclamo: number, params: HttpParams): Observable<DetalleReclamoDTO[]>{
    return this.httpUtilSrv.get<DetalleReclamoDTO[]>(`${this.url}/${idreclamo}/detalles`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  delete(idreclamo: number): Observable<any>{
    return this.httpUtilSrv.delete(`${this.url}/${idreclamo}`, AppSettings.getHttpOptionsAuth());
  }

  getPorId(idreclamo: number): Observable<ReclamoDTO>{
    return this.httpUtilSrv.get<ReclamoDTO>(`${this.url}/${idreclamo}`, AppSettings.getHttpOptionsAuth());
  }

}
