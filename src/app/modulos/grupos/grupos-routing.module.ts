import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaGruposComponent } from './vista-grupos/vista-grupos.component';
import { DetalleGrupoComponent } from './detalle-grupo/detalle-grupo.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const guardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(6)) {
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario'
    );
    return false;
  } else return true;
}

const routes: Routes = [
  { 
    path: '', component: VistaGruposComponent,    
  },
  {
    path: ':id', component: DetalleGrupoComponent,
    canActivate: [guardFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GruposRoutingModule { }
