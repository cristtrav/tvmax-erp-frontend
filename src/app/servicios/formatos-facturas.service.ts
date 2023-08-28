import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { environment } from '@environments/environment';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormatosFacturasService {

  readonly url: string = `${environment.apiURL}/formatosfacturas`

  constructor(
    private http: HttpClient
  ) { }

  get(params: HttpParams): Observable<FormatoFacturaDTO[]>{
    return this.http.get<FormatoFacturaDTO[]>(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  getTotal(params: HttpParams): Observable<number>{
    return this.http.get<number>(`${this.url}/total`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  post(formato: FormatoFacturaDTO): Observable<any>{
    return this.http.post(this.url, formato, AppSettings.getHttpOptionsAuth());
  }

  put(idformato: number, formato: FormatoFacturaDTO): Observable<any>{
    return this.http.put(`${this.url}/${idformato}`, formato, AppSettings.getHttpOptionsAuth());
  }

  delete(idformato: number): Observable<any>{
    return this.http.delete(`${this.url}/${idformato}`, AppSettings.getHttpOptionsAuth());
  }

  getPorId(idformato: number): Observable<FormatoFacturaDTO>{
    return this.http.get<FormatoFacturaDTO>(`${this.url}/${idformato}`, AppSettings.getHttpOptionsAuth());
  }
}
