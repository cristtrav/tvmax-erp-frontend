import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioDepositoDTO } from '@dto/usuario-deposito.dto';
import { environment } from '@environments/environment';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosDepositosService {

  readonly url = `${environment.apiURL}/usuariosdepositos`;

  constructor(
    private http: HttpClient
  ) { }

  get(params: HttpParams): Observable<UsuarioDepositoDTO[]>{
    return this.http.get<UsuarioDepositoDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getUltimoId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  getPorId(id: number): Observable<UsuarioDepositoDTO>{
    return this.http.get<UsuarioDepositoDTO>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  post(usuario: UsuarioDepositoDTO): Observable<any>{
    return this.http.post(this.url, usuario, AppSettings.getHttpOptionsAuth());
  }

  put(oldId: number, usuario: UsuarioDepositoDTO): Observable<any>{
    return this.http.put(`${this.url}/${oldId}`, usuario, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
