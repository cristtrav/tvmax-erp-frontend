import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DetalleReclamoDTO } from 'src/app/global/dtos/reclamos/detalle-reclamo.dto';
import { ReclamoDTO } from 'src/app/global/dtos/reclamos/reclamo.dto';
import { HttpUtilsService } from 'src/app/global/services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';
import { FinalizacionReclamoDTO } from '@global-dtos/reclamos/finalizacion-reclamo.dto';
import { MaterialUtilizadoDTO } from '@global-dtos/reclamos/material-utilizado.dto';

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

  asignarReclamo(idreclamo: number, idusuarioresponsable: number): Observable<any>{
    return this.httpUtilSrv.post(`${this.url}/${idreclamo}/asignarresponsable`, { idusuarioresponsable }, AppSettings.getHttpOptionsAuth());
  }

  liberarReclamo(idreclamo: number): Observable<any>{
    return this.httpUtilSrv.delete(`${this.url}/${idreclamo}/liberarresponsable`, AppSettings.getHttpOptionsAuth());
  }

  cambiarEstado(idreclamo: number, estado: string, observacion?: string | null): Observable<any>{
    return this.httpUtilSrv.put(`${this.url}/${idreclamo}/estado`, { estado, observacion }, AppSettings.getHttpOptionsAuth());
  }

  finalizarReclamo(idreclamo: number, finalizacion: FinalizacionReclamoDTO): Observable<any>{
    return this.httpUtilSrv.post(`${this.url}/${idreclamo}/finalizar`, finalizacion, AppSettings.getHttpOptionsAuth());
  }

  editarFinalizacionReclamo(idreclamo: number, finalizacion: FinalizacionReclamoDTO): Observable<any>{
    return this.httpUtilSrv.put(`${this.url}/${idreclamo}/finalizar`, finalizacion, AppSettings.getHttpOptionsAuth());
  }

  getMaterialesUtilizados(idreclamo: number, params: HttpParams): Observable<MaterialUtilizadoDTO[]>{
    return this.httpUtilSrv.get(`${this.url}/${idreclamo}/materiales`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
  

}
