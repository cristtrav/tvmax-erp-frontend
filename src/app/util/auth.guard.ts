import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SesionService } from '../servicios/sesion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private sesionSrv: SesionService,
    private router: Router
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const idusuario = this.sesionSrv.idusuario;
    const ar: string = route.url[0].toString();
    if (ar === 'login') {
      if (idusuario !== -1) {
        this.router.navigate(['/app/dashboard']);
        return false;
      } else {
        return true;
      }
    } else {
      if (idusuario !== -1) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

}
