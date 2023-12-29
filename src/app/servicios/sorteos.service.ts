import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { ParticipanteSorteoDTO } from '@dto/participante-sorteo.dto';
import { SorteoDTO } from '@dto/sorteo.dto';
import { environment } from '@environments/environment';
import { AppSettings } from '@util/app-settings';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SorteosService {

  readonly url: string = `${environment.apiURL}/sorteos`

  constructor(
    private http: HttpClient,
    private httpErroHandler: HttpErrorResponseHandlerService
  ) { }

  get(params: HttpParams): Observable<SorteoDTO[]>{
    return this.http.get<SorteoDTO[]>(
      this.url,
      AppSettings.getHttpOptionsAuthWithParams(params)
    );
  }

  getPorId(id: number): Observable<SorteoDTO>{
    return this.http.get<SorteoDTO>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getLastId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  post(sorteoDto: SorteoDTO): Observable<any> {
    return this.http.post(this.url, sorteoDto, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, sorteoDto: SorteoDTO): Observable<any>{
    return this.http.put(`${this.url}/${id}`, sorteoDto, AppSettings.getHttpOptionsAuth());
  }

  agregarParticipantes(criterios: CriteriosSorteoType, idsorteo: number): Observable<any>{
    return this.http.post(`${this.url}/${idsorteo}/participantes/agregar`, criterios, AppSettings.getHttpOptionsAuth());
  }

  getParticipantes(idsorteo: number, params: HttpParams): Observable<ParticipanteSorteoDTO[]>{
    return this.http.get<ParticipanteSorteoDTO[]>(`${this.url}/${idsorteo}/participantes`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalParticipantes(idsorteo: number, params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/${idsorteo}/participantes/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  deleteParticipante(idsorteo: number, idcliente: number): Observable<any>{
    return this.http.delete(`${this.url}/${idsorteo}/participantes/${idcliente}`, AppSettings.getHttpOptionsAuth());
  }
}

type CriteriosSorteoType = {
  suscritoshasta: String;
  aldiahasta: String;
}
