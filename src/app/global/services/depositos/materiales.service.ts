import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MaterialIdentificableDTO } from '@dto/material-identificable.dto';
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

  getMaterialIdentificableByMaterial(idmaterial: number, params: HttpParams): Observable<MaterialIdentificableDTO[]>{
    return this.http.get<MaterialIdentificableDTO[]>(`${this.url}/${idmaterial}/identificables`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
  
  getTotalMaterialesIdentificablesByMaterial(idmaterial: number, params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/${idmaterial}/identificables/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getIdentificables(params: HttpParams): Observable<MaterialIdentificableDTO[]>{
    return this.http.get<MaterialIdentificableDTO[]>(`${this.url}/identificables`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotalIdentificables(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/identificables/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getLastGeneratedSerial(idmaterial: number): Observable<string>{
    return this.http.get<string>(`${this.url}/${idmaterial}/identificables/ultimoserialgenerado`, AppSettings.getHttpOptionsTextAuth())
  }
}
