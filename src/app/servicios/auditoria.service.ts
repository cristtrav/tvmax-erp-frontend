import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoAuditoria } from '@dto/evento-auditoria-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
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

  getEventos(params: HttpParams): Observable<ServerResponseList<EventoAuditoria>>{
    return this.http.get<ServerResponseList<EventoAuditoria>>(`${this.url}/eventos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTablas(params: HttpParams): Observable<ServerResponseList<TablaAuditoria>>{
    return this.http.get<ServerResponseList<TablaAuditoria>>(`${this.url}/tablas`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}
