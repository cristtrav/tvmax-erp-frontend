import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MotivoReclamoDTO } from '@global-dtos/reclamos/motivo-reclamo.dto';
import { ReclamoDTO } from '@global-dtos/reclamos/reclamo.dto';
import { HttpUtilsService } from '@global-services/http-utils/http-utils.service';
import { AppSettings } from '@util/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReclamosService {

  private readonly url: string = `${environment.apiURL}/reclamos`

  constructor(
    private httpUtilSrv: HttpUtilsService
  ) { }

  post(reclamo: ReclamoDTO): Observable<any>{
    return this.httpUtilSrv.post(this.url, reclamo, AppSettings.getHttpOptionsAuth());
  }

}
