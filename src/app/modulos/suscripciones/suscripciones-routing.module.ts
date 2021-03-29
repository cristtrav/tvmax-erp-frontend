import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaSuscripcionesComponent } from './vista-suscripciones/vista-suscripciones.component';
import { DetalleSuscripcionComponent } from './detalle-suscripcion/detalle-suscripcion.component';

const routes: Routes = [
  { path: '', component: VistaSuscripcionesComponent },
  { path: ':idsuscripcion', component: DetalleSuscripcionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuscripcionesRoutingModule { }
