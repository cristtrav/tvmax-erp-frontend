import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Talonario } from '../../dtos/talonario.dto';
import { AppSettings } from '../../utils/app-settings';
import { HttpClient } from '@angular/common/http';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TalonariosService {

  private url: string = `${environment.apiURL}/talonarios`

  constructor(
    private http: HttpClient
  ) { }

  post(t: Talonario): Observable<any> {
    return this.http.post(this.url, t, AppSettings.getHttpOptionsAuth());
  }

  get(params: HttpParams): Observable<Talonario[]>{
    return this.http.get<Talonario[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getPorId(id: number): Observable<Talonario> {
    return this.http.get<Talonario>(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getUltimoId(): Observable<number>{
    return this.http.get<number>(`${this.url}/ultimoid`, AppSettings.getHttpOptionsAuth());
  }

  put(id: number, t: Talonario): Observable<any>{
    return this.http.put(`${this.url}/${id}`, t,AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.http.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }

  getFormatoPorTalonario(idtalonario: number): Observable<FormatoFacturaDTO>{
    return this.http.get<FormatoFacturaDTO>(`${this.url}/${idtalonario}/formatoimpresion`, AppSettings.getHttpOptionsAuth());
  }
}
