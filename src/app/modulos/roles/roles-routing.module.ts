import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleRolComponent } from './pages/detalle-rol/detalle-rol.component';
import { VistaRolesComponent } from './pages/vista-roles/vista-roles.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaRolesComponent },
  {
    path: ':idrol',
    component: DetalleRolComponent,
    data: { idfuncionalidad: 145, name: "Roles de Usuarios" }, 
    canActivate: [canAccessFn] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
