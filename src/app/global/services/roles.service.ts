import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RolDTO } from '@dto/rol.dto';
import { environment } from '@environments/environment';
import { AppSettings } from '@global-utils/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly url = `${environment.apiURL}/roles`;

  constructor(
    private http: HttpClient
  ) { }

  public get(params: HttpParams): Observable<RolDTO[]>{
    return this.http.get<RolDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  public getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  public post(rol: RolDTO): Observable<any>{
    return this.http.post(this.url, rol, AppSettings.getHttpOptionsAuth());
  }

  public getById(id: number): Observable<RolDTO>{
    return this.http.get<RolDTO>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  public put(oldId: number, rol: RolDTO): Observable<any>{
    return this.http.put(`${this.url}/${oldId}`, rol, AppSettings.getHttpOptionsAuth());
  }

  public delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  public getLastId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }
}
