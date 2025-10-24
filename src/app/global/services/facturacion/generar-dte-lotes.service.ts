import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

interface ParametrosGeneracionDTO {
  desde: string,
  hasta: string,
  pagado?: boolean,
  anulado: boolean,
  idestadodte: number
}

@Injectable({
  providedIn: 'root'
})
export class GenerarDteLotesService {

  private readonly url = `${environment.apiURL}/generar-dte-lotes`;

  constructor(
    private httpUtilsSrv: HttpUtilsService
  ) { }

  post(params: ParametrosGeneracionDTO): Observable<number>{
    return this.httpUtilsSrv.post<number>(this.url, params, AppSettings.getHttpOptionsAuth());
  }
}
