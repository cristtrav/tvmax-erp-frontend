import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaBarriosComponent } from './pages/vista-barrios/vista-barrios.component';
import { DetalleBarrioComponent } from './pages/detalle-barrio/detalle-barrio.component';
import { SesionService } from '@services/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const guardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(86)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Barrios'
    )
    return false;
  }else return true;
}

const routes: Routes = [
  {path: '', component: VistaBarriosComponent },
  { path: ':id', component: DetalleBarrioComponent, canActivate: [guardFn] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarriosRoutingModule { }
