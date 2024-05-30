import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTiposMaterialesComponent } from './vista-tipos-materiales/vista-tipos-materiales.component';
import { DetalleTipoMaterialComponent } from './detalle-tipo-material/detalle-tipo-material.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaTiposMaterialesComponent },
  {
    path: ':idtipo',
    component: DetalleTipoMaterialComponent,
    data: { idfuncionalidad: 605, name: 'Formulario de Grupos de Materiales' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposMaterialesRoutingModule { }
