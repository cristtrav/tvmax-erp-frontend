import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Departamento } from '../dto/departamento-dto';
import { Observable } from 'rxjs';
import { ServerResponseList } from '../dto/server-response-list.dto';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  url = `${AppSettings.urlAPI}/departamentos`;

  constructor(private http: HttpClient) { }

  post(d: Departamento): Observable<any>{
    return this.http.post(this.url, d, AppSettings.getHttpOptionsJsonTextAuth());
  }

  get(params: HttpParams): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: string): Observable<Departamento>{
    return this.http.get<Departamento>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: string, d: Departamento): Observable<any>{
    return this.http.put(`${this.url}/${id}`, d, AppSettings.getHttpOptionsJsonTextAuth());
  }

  delete(id: string | null): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsTextAuth());
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}
