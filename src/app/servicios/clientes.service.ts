import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cliente } from '../dto/cliente-dto';
import { Observable } from 'rxjs';

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

  get(pageIndex: number, pageSize: number): Observable<Cliente[]> {
    const params = new HttpParams()
    .append('limit', `${pageSize}`)
    .append('offset', `${(pageIndex-1)*pageSize}`);
    return this.http.get<Cliente[]>(this.url, { params });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }

  getTotal(): Observable<any>{
    return this.http.get(`${this.url}/total`);
  }
}
