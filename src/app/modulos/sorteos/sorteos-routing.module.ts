import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaSorteosComponent } from './vista-sorteos/vista-sorteos.component';
import { DetalleSorteoComponent } from './detalle-sorteo/detalle-sorteo.component';

const routes: Routes = [
  { path: '', component: VistaSorteosComponent },
  { path: ':idsorteo', component: DetalleSorteoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SorteosRoutingModule { }
