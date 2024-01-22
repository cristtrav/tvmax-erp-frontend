import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaMovimientosMaterialesComponent } from './vista-movimientos-materiales/vista-movimientos-materiales.component';
import { DetalleMovimientoMaterialComponent } from './detalle-movimiento-material/detalle-movimiento-material.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const accesoModuloGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(640)) {
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
  if(!inject(SesionService).permisos.has(645)) {
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Grupos de Materiales'
    );
    return false;
  } else return true;
}

const routes: Routes = [
  {path: '', component: VistaMovimientosMaterialesComponent, canActivate: [accesoModuloGuardFn] },
  {path: ':idmovimientomaterial', component: DetalleMovimientoMaterialComponent, canActivate: [accesoFormularioGuardFn]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosMaterialesRoutingModule { }
