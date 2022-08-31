import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponseList } from '../dto/server-response-list.dto';
import { Funcionario } from '@dto/funcionario.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = `${AppSettings.urlAPI}/usuarios`;

  constructor(
    private http: HttpClient
  ) { }

  post(u: Funcionario): Observable<any> {
    return this.http.post(this.url, u, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<ServerResponseList<Funcionario>> {
    return this.http.get<ServerResponseList<Funcionario>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, u: Funcionario): Observable<any> {
    return this.http.put(`${this.url}/${id}`, u, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
