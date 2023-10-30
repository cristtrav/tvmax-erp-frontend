import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaMaterialesComponent } from './vista-materiales/vista-materiales.component';
import { DetalleMaterialComponent } from './detalle-material/detalle-material.component';

const routes: Routes = [
  { path: '', component: VistaMaterialesComponent},
  { path: ':idmaterial', component: DetalleMaterialComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
