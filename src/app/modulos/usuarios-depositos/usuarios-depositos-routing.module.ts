import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaUsuariosDepositosComponent } from './pages/vista-usuarios-depositos/vista-usuarios-depositos.component';
import { DetalleUsuarioDepositoComponent } from './pages/detalle-usuario-deposito/detalle-usuario-deposito.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const accesoFormularioGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(726)) {
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Usuario de Depósito'
    );
    return false;
  } else return true;
}

const accesoModuloGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(720)) {
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al módulo Usuarios de Depósito'
    );
    return false;
  } else return true;
}

const routes: Routes = [
  { path: '', component: VistaUsuariosDepositosComponent, canActivate: [accesoModuloGuardFn] },
  { path: ':idusuariodepositos', component: DetalleUsuarioDepositoComponent, canActivate: [accesoFormularioGuardFn]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosDepositosRoutingModule { }
