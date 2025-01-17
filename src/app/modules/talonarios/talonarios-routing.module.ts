import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTalonariosComponent } from './pages/vista-talonarios/vista-talonarios.component';
import { DetalleTalonarioComponent } from './pages/detalle-talonario/detalle-talonario.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaTalonariosComponent },
  {
    path: ':idtalonario',
    component: DetalleTalonarioComponent,
    data: {idfuncionalidad: 245, name: 'Talonarios' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalonariosRoutingModule { }
