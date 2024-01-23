import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaTiposMaterialesComponent } from './vista-tipos-materiales/vista-tipos-materiales.component';
import { DetalleTipoMaterialComponent } from './detalle-tipo-material/detalle-tipo-material.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const accesoModuloGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(600)) {
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Grupos de Materiales'
    );
    return false;
  } else return true;
}

const accesoFormularioGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(605)) {
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Grupos de Materiales'
    );
    return false;
  } else return true;
}

const routes: Routes = [
  {path: '', component: VistaTiposMaterialesComponent, canActivate: [accesoModuloGuardFn]},
  {path: ':idtipo', component: DetalleTipoMaterialComponent, canActivate: [accesoFormularioGuardFn]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposMaterialesRoutingModule { }
