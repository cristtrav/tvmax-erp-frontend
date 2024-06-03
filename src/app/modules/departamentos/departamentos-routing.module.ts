import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaDepartamentosComponent } from './pages/vista-departamentos/vista-departamentos.component';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';
import { DetalleDepartamentoComponent } from './pages/detalle-departamento/detalle-departamento.component';

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
