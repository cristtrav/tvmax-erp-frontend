import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient } from '@angular/common/http';
import { Distrito } from '../dto/distrito-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistritosService {

  url: string = `${AppSettings.urlAPI}/distritos`;

  constructor(
    private http: HttpClient
  ) { }

  post(d: Distrito): Observable<any>{
    return this.http.post(this.url, d, AppSettings.httpOptionsPost);
  } 

  get(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(this.url);
  }

  getPorId(id: string): Observable<Distrito> {
    return this.http.get<Distrito>(`${this.url}/${id}`);
  }

  put(id: string, d: Distrito): Observable<any> {
    return this.http.put(`${this.url}/${id}`, d, AppSettings.httpOptionsPost);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }
}
