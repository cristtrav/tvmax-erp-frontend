import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.post(this.url, srv, AppSettings.getHttpOptionsJsonTextAuth());
  }

  getServicios(filters: Array<{key: string, value: any | null}>): Observable<Servicio[]> {
    let params = new HttpParams();
    for(let p of filters){
      params = params.append(p.key, p.value);
    }
    return this.http.get<Servicio[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalRegistros(filters: Array<{key: string, value: any | null}>): Observable<number>{
    let params = new HttpParams();
    for(let p of filters){
      params = params.append(p.key, p.value);
    }
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getServicioPorId(id: number): Observable<Servicio>{
    return this.http.get<Servicio>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  putServicio(id: number, srv: Servicio): Observable<any> {
    return this.http.put(`${this.url}/${id}`, srv, AppSettings.getHttpOptionsJsonTextAuth());
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsTextAuth())
  }
}
