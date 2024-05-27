import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';
import { DetalleGrupoComponent } from './pages/detalle-grupo/detalle-grupo.component';
import { VistaGruposComponent } from './pages/vista-grupos/vista-grupos.component';

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
