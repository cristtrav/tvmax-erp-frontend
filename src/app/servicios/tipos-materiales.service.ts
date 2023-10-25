import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoMaterialDTO } from '@dto/tipo-material.dto';
import { environment } from '@environments/environment';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposMaterialesService {

  private url: string = `${environment.apiURL}/tiposmateriales`;

  constructor(
    private http: HttpClient
  ) { }

  get(params: HttpParams): Observable<TipoMaterialDTO[]>{
    return this.http.get<TipoMaterialDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getCount(): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuth())
  }

  getLastId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`);
  }

  post(tipoMaterial: TipoMaterialDTO): Observable<any>{
    return this.http.post(this.url, tipoMaterial, AppSettings.getHttpOptionsAuth());
  }
  
  getPorId(idtipo: number): Observable<TipoMaterialDTO>{
    return this.http.get<TipoMaterialDTO>(`${this.url}/${idtipo}`, AppSettings.getHttpOptionsAuth());
  }

  put(oldId: number, tipoMaterial: TipoMaterialDTO): Observable<any>{
    return this.http.put(`${this.url}/${oldId}`, tipoMaterial, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
