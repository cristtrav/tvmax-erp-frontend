import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaDepartamentosComponent } from './vista-departamentos/vista-departamentos.component';
import { DetalleDepartamentoComponent } from './detalle-departamento/detalle-departamento.component';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaDepartamentosComponent },
  {
    path: ':id',
    component: DetalleDepartamentoComponent,
    data: { idfuncionalidad: 45, name: "Formulario de Departamentos" },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentosRoutingModule { }
