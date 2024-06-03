import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { SesionService } from '@services/sesion.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

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
