import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaSorteosComponent } from './vista-sorteos/vista-sorteos.component';
import { DetalleSorteoComponent } from './detalle-sorteo/detalle-sorteo.component';
import { VistaPremiosComponent } from './vista-premios/vista-premios.component';
import { DetallePremioComponent } from './detalle-premio/detalle-premio.component';
import { ParticipantesComponent } from './participantes/participantes.component';
import { ExclusionesComponent } from './exclusiones/exclusiones.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const accesoSorteoGuardFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(400)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al módulo Sorteos'
    )
    return false;
  } else return true;
}

const formSorteoGuardFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(405)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Sorteos'
    )
    return false;
  } else return true;
}

const routes: Routes = [
  { path: '', component: VistaSorteosComponent, canActivate: [accesoSorteoGuardFn]},
  { path: 'exclusiones', component: ExclusionesComponent },
  { path: ':idsorteo', component: DetalleSorteoComponent, canActivate: [formSorteoGuardFn] },
  { path: ':idsorteo/premios', component: VistaPremiosComponent },
  { path: ':idsorteo/premios/:idpremio', component: DetallePremioComponent },
  { path: ':idsorteo/participantes', component: ParticipantesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SorteosRoutingModule { }
