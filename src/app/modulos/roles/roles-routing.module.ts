import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleRolComponent } from './detalle-rol/detalle-rol.component';
import { VistaRolesComponent } from './vista-roles/vista-roles.component';

const routes: Routes = [
  {path: '', component: VistaRolesComponent},
  {path: ':idrol', component: DetalleRolComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
