import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ReiteracionDTO } from '@global-dtos/reclamos/reiteracion.dto';
import { HttpUtilsService } from '@global-services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
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
}
