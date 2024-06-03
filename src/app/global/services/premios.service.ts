import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { SorteosService } from './sorteos.service';
import { PremioDTO } from '@dto/premio.dto';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PremiosService {

  readonly url: string = `${environment.apiURL}/premios`;
  readonly urlSorteos: string = `${environment.apiURL}/sorteos`;

  constructor(
    private http: HttpClient,
    private sorteosSrv: SorteosService
  ) { }

  getPremiosPorSorteo(idsorteo: number, params: HttpParams): Observable<PremioDTO[]>{
    return this.http.get<PremioDTO[]>(`${this.urlSorteos}/${idsorteo}/premios`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalPremiosPorSorteo(idsorteo: number, params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.urlSorteos}/${idsorteo}/premios/total`, AppSettings.getHttpOptionsAuthWithParams(params))
  }

  getUltimoId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  post(premioDto: PremioDTO): Observable<any>{
    return this.http.post(this.url, premioDto, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(oldId: number, premioDto: PremioDTO): Observable<any>{
    return this.http.put(`${this.url}/${oldId}`, premioDto, AppSettings.getHttpOptionsAuth());
  }

  getPremioPorId(id: number): Observable<PremioDTO>{
    return this.http.get<PremioDTO>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
