import { Injectable } from '@angular/core';
import { ConsultaRucSifenDTO } from '@dto/facturacion/consulta-ruc-sifen.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SifenService {

  readonly url = `${environment.apiURL}/sifen`;

  constructor(
    private httpUtilSrv: HttpUtilsService
  ) { }

  consultarRuc(ci: string): Observable<ConsultaRucSifenDTO>{
    return this.httpUtilSrv.get<ConsultaRucSifenDTO>(`${this.url}/consultaruc/${ci}`, AppSettings.getHttpOptionsAuth())
  }
}
