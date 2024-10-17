import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleContribuyenteComponent } from './pages/detalle-contribuyente/detalle-contribuyente.component';

const routes: Routes = [
  { path: '', component: DetalleContribuyenteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContribuyenteRoutingModule { }
