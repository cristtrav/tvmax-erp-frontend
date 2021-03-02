import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from './../dto/servicio-dto';
import { AppSettings } from './../util/app-settings';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private url: string = `${AppSettings.urlAPI}/servicios`;

  constructor(private http: HttpClient) { }

  postServicio(srv: Servicio): Observable<any> {
    return this.http.post(this.url, srv, AppSettings.httpOptionsPost);
  }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.url);
  }

  getServicioPorId(id: number): Observable<Servicio>{
    return this.http.get<Servicio>(`${this.url}/${id}`);
  }

  putServicio(id: number, srv: Servicio): Observable<any> {
    return this.http.put(`${this.url}/${id}`, srv, AppSettings.httpOptionsPost);
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'})
  }
}
