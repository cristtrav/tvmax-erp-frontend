import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorResponseHandlerService {

  constructor(private notif: NzNotificationService) { }

  public handle(e: HttpErrorResponse): void{
    if(e.status === 403){
      this.notif.create('warning', 'No autorizado', 'El usuario no tiene permisos para realizar esta acción.')
    }else{
      //var srvError = JSON.parse(e.error);
      //this.notif.create('error', this.getTitulo(srvError.request), srvError.description)
      this.notif.create('error', this.getTitulo(e.error.request), e.error.description)
    }
  }

  private getTitulo(request: string): string {
    if(request === 'get') return 'Error al consultar'
    if(request === 'post') return 'Error al registrar'
    if(request === 'put') return 'Error al editar'
    if(request === 'delete') return 'Error al eliminar'
    return 'error';
  }
}

