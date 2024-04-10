import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaSorteosComponent } from './vista-sorteos/vista-sorteos.component';
import { DetalleSorteoComponent } from './detalle-sorteo/detalle-sorteo.component';
import { VistaPremiosComponent } from './vista-premios/vista-premios.component';
import { DetallePremioComponent } from './detalle-premio/detalle-premio.component';
import { ParticipantesComponent } from './participantes/participantes.component';
import { ExclusionesComponent } from './exclusiones/exclusiones.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  {
    path: '',
    component: VistaSorteosComponent,
    data: { idfuncionalidad: 400, name: "Sorteos" },
    canActivate: [canAccessFn]
  },
  {
    path: 'exclusiones',
    component: ExclusionesComponent,
    data: {idfuncionalidad: 520, name: "Exclusiones de Sorteos"},
    canActivate: [canAccessFn]
  },
  {
    path: ':idsorteo',
    component: DetalleSorteoComponent,
    data: { idfuncionalidad: 405, name: "Formulario de Sorteo" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idsorteo/premios',
    component: VistaPremiosComponent,
    data: {idfuncionalidad: 480, name: "Premios"},
    canActivate: [canAccessFn]
  },
  {
    path: ':idsorteo/premios/:idpremio',
    component: DetallePremioComponent,
    data: {idfuncionalidad: 481, name: "Formulario de Premio"},
    canActivate: [canAccessFn]
  },
  {
    path: ':idsorteo/participantes',
    component: ParticipantesComponent,
    data: {idfuncionalidad: 440, name: "Participantes de Sorteos"},
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SorteosRoutingModule { }
