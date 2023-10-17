import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTiposMaterialesComponent } from './vista-tipos-materiales/vista-tipos-materiales.component';

const routes: Routes = [
  {path: '', component: VistaTiposMaterialesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposMaterialesRoutingModule { }
