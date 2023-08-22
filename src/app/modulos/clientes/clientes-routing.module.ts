import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaClientesComponent } from './../../modulos/clientes/vista-clientes/vista-clientes.component';
import { DetalleClienteComponent } from './../../modulos/clientes/detalle-cliente/detalle-cliente.component';
import { DomiciliosClienteComponent } from './domicilios-cliente/domicilios-cliente.component';
import { DetalleDomicilioClienteComponent } from './detalle-domicilio-cliente/detalle-domicilio-cliente.component';
import { SuscripcionesClienteComponent } from './suscripciones-cliente/suscripciones-cliente.component';
import { DetalleSuscripcionClienteComponent } from './detalle-suscripcion-cliente/detalle-suscripcion-cliente.component';
import { CuotasSuscripcionClienteComponent } from './cuotas-suscripcion-cliente/cuotas-suscripcion-cliente.component';
import { DetalleCuotasSuscripcionClienteComponent } from './detalle-cuotas-suscripcion-cliente/detalle-cuotas-suscripcion-cliente.component';
import { PagosClienteComponent } from './pagos-cliente/pagos-cliente.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const formClientesGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(185)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Clientes'
    );
    return false;
  }else return true;
}

const formDomiGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(204)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Domicilios'
    );
    return false;
  }else return true;
}

const domicilioGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(206)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al módulo Domicilios'
    );
    return false;
  }else return true;
}

const suscripcionGuardFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(165)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al módulo Suscripciones'
    );
    return false;
  }else return true;
}

const routes: Routes = [
  { path: '', component: VistaClientesComponent },
  { path: ':idcliente', component: DetalleClienteComponent, canActivate: [formClientesGuardFn] },
  { path: ':idcliente/domicilios', component: DomiciliosClienteComponent, canActivate: [domicilioGuardFn] },
  { path: ':idcliente/pagos', component: PagosClienteComponent},
  { path: ':idcliente/domicilios/:iddomicilio', component: DetalleDomicilioClienteComponent, canActivate: [formDomiGuardFn]},
  { path: ':idcliente/suscripciones', component: SuscripcionesClienteComponent, canActivate: [suscripcionGuardFn] },
  { path: ':idcliente/suscripciones/:idsuscripcion', component: DetalleSuscripcionClienteComponent },
  { path: ':idcliente/suscripciones/:idsuscripcion/cuotas', component: CuotasSuscripcionClienteComponent},
  { path: ':idcliente/suscripciones/:idsuscripcion/cuotas/:idcuota', component: DetalleCuotasSuscripcionClienteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
