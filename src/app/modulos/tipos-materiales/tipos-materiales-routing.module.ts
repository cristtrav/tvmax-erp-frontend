import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTiposMaterialesComponent } from './vista-tipos-materiales/vista-tipos-materiales.component';
import { DetalleTipoMaterialComponent } from './detalle-tipo-material/detalle-tipo-material.component';

const routes: Routes = [
  {path: '', component: VistaTiposMaterialesComponent},
  {path: ':idtipo', component: DetalleTipoMaterialComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposMaterialesRoutingModule { }
