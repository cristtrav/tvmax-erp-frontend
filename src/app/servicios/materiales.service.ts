import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MaterialDTO } from '@dto/material.dto';
import { environment } from '@environments/environment';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  private url: string = `${environment.apiURL}/materiales`;

  constructor(
    private http: HttpClient
  ) { }

  get(params: HttpParams): Observable<MaterialDTO[]>{
    return this.http.get<MaterialDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<MaterialDTO>{
    return this.http.get<MaterialDTO>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  post(material: MaterialDTO): Observable<any>{
    return this.http.post(this.url, material, AppSettings.getHttpOptionsAuth());
  }

  put(oldId: number, material: MaterialDTO): Observable<any>{
    return this.http.put(`${this.url}/${oldId}`, material, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getLastId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }
}