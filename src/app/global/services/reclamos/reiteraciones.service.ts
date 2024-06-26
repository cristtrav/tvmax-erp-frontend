import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ReiteracionDTO } from '@dto/reclamos/reiteracion.dto';
import { HttpUtilsService } from '@services/http-utils/http-utils.service';
import { AppSettings } from '@global-utils/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReiteracionesService {

  readonly url = `${environment.apiURL}/reiteracionesreclamos`

  constructor(
    private httpUtilSrv: HttpUtilsService
  ) { }

  post(reiteracion: ReiteracionDTO): Observable<any>{
    return this.httpUtilSrv.post(this.url, reiteracion, AppSettings.getHttpOptionsAuth());
  }

  delete(id: number): Observable<any>{
    return this.httpUtilSrv.delete(`${this.url}/${id}`, AppSettings.getHttpOptionsAuth());
  }
}
