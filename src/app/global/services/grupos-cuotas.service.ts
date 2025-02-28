import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpUtilsService } from './http-utils/http-utils.service';
import { Observable } from 'rxjs';
import { CuotaGrupoDTO } from '@dto/cuota-grupo.dto';
import { AppSettings } from '@util/app-settings';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GruposCuotasService {

  readonly url: string = `${environment.apiURL}/gruposcuotas`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(params: HttpParams): Observable<CuotaGrupoDTO[]>{
    return this.httpUtils.get(this.url, AppSettings.getHttpOptionsAuthWithParams(params));
  }

  post(cuotaGrupo: CuotaGrupoDTO): Observable<CuotaGrupoDTO>{
    return this.httpUtils.post(this.url, cuotaGrupo, AppSettings.getHttpOptionsAuth())
  }
}
