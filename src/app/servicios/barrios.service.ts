import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient } from '@angular/common/http';
import { Barrio } from '../dto/barrio-dto';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BarriosService {

  url: string = `${AppSettings.urlAPI}/barrios`;

  constructor(
    private http: HttpClient
  ) { }

  post(b: Barrio): Observable<any>{
    return this.http.post(this.url, b, AppSettings.httpOptionsPost);
  }

  get(): Observable<Barrio[]> {
    return this.http.get<Barrio[]>(this.url);
  }

  getPorId(id: number): Observable<Barrio>{
    return this.http.get<Barrio>(`${this.url}/${id}`);
  }

  put(id: number, b: Barrio): Observable<any> {
    return this.http.put(`${this.url}/${id}`, b, AppSettings.httpOptionsPost);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }

}
