import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaSuscripcionesComponent } from './vista-suscripciones/vista-suscripciones.component';
import { DetalleSuscripcionComponent } from './detalle-suscripcion/detalle-suscripcion.component';
import { CuotasSuscripcionesComponent } from './cuotas-suscripciones/cuotas-suscripciones.component';
import { DetalleCuotasSuscripcionesComponent } from './detalle-cuotas-suscripciones/detalle-cuotas-suscripciones.component';
import { ReporteSuscripcionesComponent } from '../impresion/reporte-suscripciones/reporte-suscripciones.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const formSuscGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(166)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Suscripciones'
    );
    return false;
  }else return true;
}

const formCuotaGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(224)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Cuotas'
    );
    return false;
  }else return true;
}

const routes: Routes = [
  { path: '', component: VistaSuscripcionesComponent},
  { path: 'reporte', component: ReporteSuscripcionesComponent},
  { path: ':idsuscripcion', component: DetalleSuscripcionComponent, canActivate: [formSuscGuardFn] },
  { path: ':idsuscripcion/cuotas', component: CuotasSuscripcionesComponent },
  { path: ':idsuscripcion/cuotas/:idcuota', component: DetalleCuotasSuscripcionesComponent, canActivate: [formCuotaGuardFn]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuscripcionesRoutingModule { }
