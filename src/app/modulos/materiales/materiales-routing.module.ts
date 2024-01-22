import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaMaterialesComponent } from './vista-materiales/vista-materiales.component';
import { DetalleMaterialComponent } from './detalle-material/detalle-material.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const accesoModuloGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(680)) {
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Materiales'
    );
    return false;
  } else return true;
}

const accesoFormularioGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(685)) {
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Materiales'
    );
    return false;
  } else return true;
}

const routes: Routes = [
  { path: '', component: VistaMaterialesComponent, canActivate: [accesoModuloGuardFn]},
  { path: ':idmaterial', component: DetalleMaterialComponent, canActivate: [accesoFormularioGuardFn]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
