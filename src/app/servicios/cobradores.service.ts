import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient } from '@angular/common/http';
import { Cobrador } from '../dto/cobrador-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CobradoresService {

  url = `${AppSettings.urlAPI}/cobradores`;

  constructor(
    private http: HttpClient
  ) { }

  post(c: Cobrador): Observable<any> {
    return this.http.post(this.url, c, AppSettings.httpOptionsPost);
  }

  getPorId(id: number): Observable<Cobrador> {
    return this.http.get<Cobrador>(`${this.url}/${id}`);
  }

  put(id: number, c: Cobrador): Observable<any> {
    return this.http.put(`${this.url}/${id}`, c, AppSettings.httpOptionsPost);
  }

  get(): Observable<Cobrador[]> {
    return this.http.get<Cobrador[]>(this.url);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }
}
