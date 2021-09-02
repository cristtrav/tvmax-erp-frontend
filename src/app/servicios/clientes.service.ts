import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cliente } from '../dto/cliente-dto';
import { Observable } from 'rxjs';
import { ServerResponseList } from '../dto/server-response-list.dto';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  url = `${AppSettings.urlAPI}/clientes`;

  constructor(
    private http: HttpClient
  ) { }

  post(c: Cliente): Observable<any> {
    return this.http.post(this.url, c, AppSettings.httpOptionsPost);
  }

  getPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  put(id: number, c: Cliente): Observable<any> {
    return this.http.put(`${this.url}/${id}`, c, AppSettings.httpOptionsPost);
  }

  get(params: HttpParams): Observable<ServerResponseList<Cliente>> {
    return this.http.get<ServerResponseList<Cliente>>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getTotal(): Observable<any>{
    return this.http.get(`${this.url}/total`);
  }
}

interface IFilter{
  key: string,
  value: string
}