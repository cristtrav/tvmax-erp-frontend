import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '@dto/usuario.dto';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = `${environment.apiURL}/usuarios`;

  constructor(
    private http: HttpClient
  ) { }

  post(u: Usuario): Observable<any> {
    return this.http.post(this.url, u, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, u: Usuario): Observable<any> {
    return this.http.put(`${this.url}/${id}`, u, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getLastId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  changePassword(idusuario: number, oldPass: string, newPass: string): Observable<any>{
    return this.http.post(`${this.url}/${idusuario}/password`, {oldPass, newPass}, AppSettings.getHttpOptionsAuth());
  }
}
