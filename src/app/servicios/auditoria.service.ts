import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoAuditoria } from '@dto/evento-auditoria-dto';
import { TablaAuditoria } from '@dto/tabla-auditoria-dto';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  url: string = `${AppSettings.urlAPI}/auditoria`;

  constructor(
    private http: HttpClient
  ) { }

  getEventos(params: HttpParams): Observable<EventoAuditoria[]> {
    return this.http.get<EventoAuditoria[]>(`${this.url}/eventos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalEventos(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/eventos/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTablas(params: HttpParams): Observable<TablaAuditoria[]> {
    return this.http.get<TablaAuditoria[]>(`${this.url}/tablas`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalTablas(params: HttpParams): Observable<number> {
    return this.http.get<number>(`${this.url}/tablas/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}
