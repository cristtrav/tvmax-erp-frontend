import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaGruposComponent } from './vista-grupos/vista-grupos.component';
import { DetalleGrupoComponent } from './detalle-grupo/detalle-grupo.component';

const routes: Routes = [
  { 
    path: '', component: VistaGruposComponent
  },
  {
    path: ':id', component: DetalleGrupoComponent, data: {breadcrumb: ':id'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GruposRoutingModule { }
