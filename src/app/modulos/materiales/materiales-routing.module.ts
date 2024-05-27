import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaMaterialesComponent } from './vista-materiales/vista-materiales.component';
import { DetalleMaterialComponent } from './detalle-material/detalle-material.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaMaterialesComponent },
  {
    path: ':idmaterial',
    component: DetalleMaterialComponent,
    data: { idfuncionalidad: 685, name: 'Formulario de Materiales' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
