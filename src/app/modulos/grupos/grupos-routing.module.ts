import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaGruposComponent } from './vista-grupos/vista-grupos.component';
import { DetalleGrupoComponent } from './detalle-grupo/detalle-grupo.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaGruposComponent },
  {
    path: ':id', component: DetalleGrupoComponent,
    data: { idfuncionalidad: 6, name: "Formulario de Grupos" },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GruposRoutingModule { }
