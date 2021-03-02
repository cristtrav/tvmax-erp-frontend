import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaBarriosComponent } from './vista-barrios/vista-barrios.component';
import { DetalleBarrioComponent } from './detalle-barrio/detalle-barrio.component';

const routes: Routes = [
  {path: '', component: VistaBarriosComponent },
  { path: ':id', component: DetalleBarrioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarriosRoutingModule { }
