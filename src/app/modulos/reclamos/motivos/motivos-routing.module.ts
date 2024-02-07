import { NgModule, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaMotivosComponent } from './vista-motivos/vista-motivos.component';
import { DetalleMotivoComponent } from './detalle-motivo/detalle-motivo.component';


const routes: Routes = [
  { path: '', component: VistaMotivosComponent },
  { path: ':idmotivo', component: DetalleMotivoComponent, data: {breadcrumb: 'detalle'} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotivosRoutingModule { }
