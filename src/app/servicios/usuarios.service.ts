import { Injectable } from '@angular/core';
import { AppSettings } from '../util/app-settings';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '@dto/usuario.dto';
import { environment } from '@environments/environment';
import { RolDTO } from '@dto/rol.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = `${environment.apiURL}/usuarios`;

  constructor(
    private http: HttpClient
  ) { }

  post(u: UsuarioDTO): Observable<any> {
    return this.http.post(this.url, u, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, u: UsuarioDTO): Observable<any> {
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

  getRolesByUsuario(idusuario: number): Observable<RolDTO[]>{
    return this.http.get<RolDTO[]>(`${this.url}/${idusuario}/roles`, AppSettings.getHttpOptionsAuth());
  }

  editRolesByUsuario(idusuario: number, idroles: number[]): Observable<any>{
    return this.http.put(`${this.url}/${idusuario}/roles`, { idroles }, AppSettings.getHttpOptionsAuth());
  }
}
