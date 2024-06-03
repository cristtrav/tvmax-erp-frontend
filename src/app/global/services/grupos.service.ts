import { Injectable } from '@angular/core';
import { AppSettings } from '../../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Grupo } from '../dtos/grupo-dto';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private url = `${environment.apiURL}/grupos`;

  constructor(private http: HttpClient) { }

  getGrupos(params: HttpParams): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  postGrupo(g: Grupo): Observable<any>{
    return this.http.post(this.url, g, AppSettings.getHttpOptionsJsonTextAuth());
  }

  deleteGrupo(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsTextAuth());
  }

  getGrupoPorId(id: number): Observable<Grupo>{
    return this.http.get<Grupo>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  putGrupo(id: number, g: Grupo): Observable<any>{
    return this.http.put(`${this.url}/${id}`, g, AppSettings.getHttpOptionsJsonTextAuth());
  }

  getLastId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }
}