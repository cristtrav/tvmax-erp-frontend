import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaSorteosComponent } from './vista-sorteos/vista-sorteos.component';
import { DetalleSorteoComponent } from './detalle-sorteo/detalle-sorteo.component';
import { VistaPremiosComponent } from './vista-premios/vista-premios.component';
import { DetallePremioComponent } from './detalle-premio/detalle-premio.component';

const routes: Routes = [
  { path: '', component: VistaSorteosComponent },
  { path: ':idsorteo', component: DetalleSorteoComponent },
  { path: ':idsorteo/premios', component: VistaPremiosComponent },
  { path: ':idsorteo/premios/:idpremio', component: DetallePremioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SorteosRoutingModule { }
