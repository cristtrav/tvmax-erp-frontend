import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Distrito } from '../dto/distrito-dto';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DistritosService {

  url: string = `${environment.apiURL}/distritos`;

  constructor(
    private http: HttpClient
  ) { }

  post(d: Distrito): Observable<any>{
    return this.http.post(this.url, d, AppSettings.getHttpOptionsAuth());
  } 

  get(params: HttpParams): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: string): Observable<Distrito> {
    return this.http.get<Distrito>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: string, d: Distrito): Observable<any> {
    return this.http.put(`${this.url}/${id}`, d, AppSettings.getHttpOptionsAuth());
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getTotalRegistros(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
}
