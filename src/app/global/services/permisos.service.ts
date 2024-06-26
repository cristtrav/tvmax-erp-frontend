import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Funcionalidad } from '@dto/funcionalidad-dto';
import { Modulo } from '@dto/modulo-dto';
import { environment } from '@environments/environment';
import { AppSettings } from '@global-utils/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private url: string = `${environment.apiURL}/permisos`;

  constructor(
    private http: HttpClient
  ) { }

  getModulosFuncionalidades(params: HttpParams): Observable<Modulo[]>{
    return this.http.get<Modulo[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPermisosUsuario(idusuario: number, params: HttpParams): Observable<Funcionalidad[]> {
    return this.http.get<Funcionalidad[]>(`${this.url}/${idusuario}`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  putPermisosUsuario(idusuario: number, funcionalidades: number[]): Observable<any>{
    return this.http.put(`${this.url}/${idusuario}`, funcionalidades, AppSettings.getHttpOptionsAuth());
  }
}
