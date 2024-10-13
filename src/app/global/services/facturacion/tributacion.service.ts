import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportarCsvService {

  readonly url = `${environment.apiURL}/exportarcsv`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  public getTotal(params: HttpParams): Observable<number>{
    return this.httpUtils.get(`${this.url}/ventas/totalarchivos`, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  public getFile(params: HttpParams): Observable<any>{
    return this.httpUtils.get(`${this.url}/ventas/archivo`, AppSettings.getHttpOptionsBlobAuthWithParams(params));
  }
}
