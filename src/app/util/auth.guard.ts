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
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const idusuario = this.sesionSrv.idusuario;
    const activatedRoute: string = route.url[0].toString();
    
    if(idusuario === -1)
      if(activatedRoute === 'login') return true;
      else return this.router.createUrlTree(['/login'])
    else
      if(activatedRoute !== 'login') return true;
      else return this.router.createUrlTree(['/app', 'dashboard']);;
  }

}
