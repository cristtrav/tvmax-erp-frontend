import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoClienteDTO } from '@dto/tipo-cliente.dto';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpUtilsService } from './http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';

@Injectable({
  providedIn: 'root'
})
export class TiposclientesService {

  url = `${environment.apiURL}/tiposclientes`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<TipoClienteDTO[]>{
    return this.httpUtils.get(`${this.url}`, AppSettings.getHttpOptionsAuthWithParams(params));
  }
  
}
