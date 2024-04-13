import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { SesionService } from "@servicios/sesion.service";
import { NzNotificationService } from "ng-zorro-antd/notification";

export const canAccessFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const idfuncionalidad = route.data.idfuncionalidad;
    if(idfuncionalidad == null) return false;
    const routeName = route.data.name ?? '';
    if(!inject(SesionService).permisos.has(idfuncionalidad)){
        inject(NzNotificationService).create(
          'error',
          '<strong>No autorizado</strong>',
          `El usuario no tiene permisos para acceder a la página${routeName ? ' «'+routeName+'».': '.'}`
        )
        return false;
      } else return true;
}