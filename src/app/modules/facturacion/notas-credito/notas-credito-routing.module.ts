import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaNotasCreditoComponent } from './pages/vista-notas-credito/vista-notas-credito.component';
import { DetalleNotaCreditoComponent } from './pages/detalle-nota-credito/detalle-nota-credito.component';

const routes: Routes = [
  { path: '', component: VistaNotasCreditoComponent },
  //{ path: ':id', component: DetalleNotaCreditoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotasCreditoRoutingModule { }
