import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaCscComponent } from './pages/vista-csc/vista-csc.component';
import { DetalleCscComponent } from './pages/detalle-csc/detalle-csc.component';

const routes: Routes = [
  { path: '', component: VistaCscComponent },
  { path: ':id', component: DetalleCscComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodigosSeguridadContribuyenteRoutingModule { }
