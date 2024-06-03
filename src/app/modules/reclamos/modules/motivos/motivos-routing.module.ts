import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaMotivosComponent } from './pages/vista-motivos/vista-motivos.component';
import { DetalleMotivoComponent } from './pages/detalle-motivo/detalle-motivo.component';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';

const routes: Routes = [
  {
    path: '',
    component: VistaMotivosComponent
  },
  {
    path: ':idmotivo',
    component: DetalleMotivoComponent,
    data: { idfuncionalidad: 761, name: 'Formulario de Motivos' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotivosRoutingModule { }
