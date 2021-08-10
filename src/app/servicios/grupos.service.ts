import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Grupo } from '../dto/grupo-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private url = `${AppSettings.urlAPI}/grupos`;

  constructor(private http: HttpClient) { }

  getGrupos(filters: IFilter[]): Observable<Grupo[]> {
    var params: HttpParams = new HttpParams();
    for(let f of filters){
      params = params.append(f.key, `${f.value}`);
    }
    return this.http.get<Grupo[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(filters: IFilter[]): Observable<number>{
    var params: HttpParams = new HttpParams();
    for(let f of filters){
      params = params.append(f.key, `${f.value}`);
    }
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
}

interface IFilter {
  key: string,
  value: string
}