import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaDepartamentosComponent } from './vista-departamentos/vista-departamentos.component';
import { DetalleDepartamentoComponent } from './detalle-departamento/detalle-departamento.component';

const routes: Routes = [
  { path: '', component: VistaDepartamentosComponent },
  { path: ':id', component: DetalleDepartamentoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentosRoutingModule { }
