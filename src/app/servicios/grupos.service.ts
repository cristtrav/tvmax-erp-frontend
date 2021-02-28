import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient } from '@angular/common/http';
import { Grupo } from '../dto/grupo-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private url = `${AppSettings.urlAPI}/grupos`;

  constructor(private http: HttpClient) { }

  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.url);
  }

  postGrupo(g: Grupo): Observable<any>{
    return this.http.post(this.url, g, AppSettings.httpOptionsPost);
  }

  deleteGrupo(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }

  getGrupoPorId(id: number): Observable<Grupo>{
    return this.http.get<Grupo>(`${this.url}/${id}`);
  }

  putGrupo(g: Grupo): Observable<any>{
    return this.http.put(`${this.url}/${g.id}`, g, AppSettings.httpOptionsPost);
  }
}
