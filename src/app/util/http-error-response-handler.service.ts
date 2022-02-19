import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorResponseHandlerService {

  constructor(private notif: NzNotificationService) { }

  public handle(e: HttpErrorResponse | unknown, actionName?: string): void {
    if(e instanceof HttpErrorResponse){
      if (e.status === 403) {
        this.notif.create('warning', 'No autorizado', 'El usuario no tiene permisos para realizar esta acción.')
      } else {
        var srvError = typeof e.error === 'string' ? JSON.parse(e.error) : e.error;
        //this.notif.create('error', this.getTitulo(srvError.request), srvError.description)
        this.notif.create('error', this.getTitulo(srvError.request, actionName), srvError.description ?? e.message)
      }
    }else{
      this.notif.create('error', 'Error desconocido', `${e}`);
    }
  }

  private getTitulo(request: string, actionName?: string): string {
    if (actionName) {
      return `<b>Error al ${actionName}</b>`;
    } else {
      if (request === 'get') return `<b>Error al consultar</b>`
      if (request === 'post') return `<b>Error al registrar</b>`
      if (request === 'put') return `<b>Error al editar}</b>`
      if (request === 'delete') return `<b>Error al eliminar}</b>`
      return `<b>Error al efectuar la operación</b>`;
    }
  }
}

