import { Injectable } from '@angular/core';
import { DatoContribuyenteDTO } from '@dto/facturacion/dato-contribuyente.dto';
import { environment } from '@environments/environment';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosContribuyenteService {

  readonly url = `${environment.apiURL}/datoscontribuyente`;

  constructor(
    private httpUtils: HttpUtilsService
  ) { }

  get(): Observable<DatoContribuyenteDTO[]>{
    return this.httpUtils.get<DatoContribuyenteDTO[]>(this.url, AppSettings.getHttpOptionsAuth());
  }

  post(datos: DatoContribuyenteDTO[]): Observable<any>{
    return this.httpUtils.post(this.url, datos, AppSettings.getHttpOptionsAuth());
  }
}
