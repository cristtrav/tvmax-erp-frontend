import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaDistritosComponent } from './vista-distritos/vista-distritos.component';
import { DetalleDistritoComponent } from './detalle-distrito/detalle-distrito.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const guardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(65)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Distritos'
    );
    return false;
  }else return true;
}

const routes: Routes = [
  { path: '', component: VistaDistritosComponent },
  { path: ':id', component: DetalleDistritoComponent, canActivate: [guardFn]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistritosRoutingModule { }
