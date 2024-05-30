import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaUsuariosComponent } from './pages/vista-usuarios/vista-usuarios.component';
import { DetalleUsuarioComponent } from './pages/detalle-usuario/detalle-usuario.component';
import { PermisosUsuarioComponent } from './pages/permisos-usuario/permisos-usuario.component';
import { RolesUsuarioComponent } from './pages/roles-usuario/roles-usuario.component';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaUsuariosComponent },
  {
    path: ':idusuario',
    component: DetalleUsuarioComponent,
    data: { idfuncionalidad: 126, name: "Formulario de Usuario" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idusuario/permisos',
    component: PermisosUsuarioComponent,
    data: { idfuncionalidad: 283, name: "Permisos de Usuario" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idusuario/roles',
    component: RolesUsuarioComponent,
    data: { idfuncionalidad: 840, name: "Roles de Usuario" },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
