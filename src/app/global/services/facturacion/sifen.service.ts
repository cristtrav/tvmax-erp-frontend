import { HttpClient } from '@angular/common/http';
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
    private http: HttpClient
  ) { }

  consultarRuc(ci: string): Observable<ConsultaRucSifenDTO>{
    return this.http.get<ConsultaRucSifenDTO>(`${this.url}/consultaruc/${ci}`, AppSettings.getHttpOptionsAuth())
  }
}
