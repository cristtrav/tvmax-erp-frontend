import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaUsuariosComponent } from './vista-usuarios/vista-usuarios.component';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';
import { PermisosUsuarioComponent } from './permisos-usuario/permisos-usuario.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RolesUsuarioComponent } from './roles-usuario/roles-usuario.component';

const guardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(126)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Usuarios'
    );
    return false;
  }else return true;
}

const formPermisosGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(283)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Permisos'
    );
    return false;
  }else return true;
}

const routes: Routes = [
  { path: '', component: VistaUsuariosComponent },
  { path: ':idusuario', component: DetalleUsuarioComponent, canActivate: [guardFn]},
  { path: ':idusuario/permisos', component: PermisosUsuarioComponent, canActivate: [formPermisosGuardFn] },
  { path: ':idusuario/roles', component: RolesUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
