import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaClientesComponent } from './../../modulos/clientes/vista-clientes/vista-clientes.component';
import { DetalleClienteComponent } from './../../modulos/clientes/detalle-cliente/detalle-cliente.component';
import { DomiciliosClienteComponent } from './domicilios-cliente/domicilios-cliente.component';
import { DetalleDomicilioClienteComponent } from './detalle-domicilio-cliente/detalle-domicilio-cliente.component';
import { SuscripcionesClienteComponent } from './suscripciones-cliente/suscripciones-cliente.component';
import { DetalleSuscripcionClienteComponent } from './detalle-suscripcion-cliente/detalle-suscripcion-cliente.component';
import { CuotasSuscripcionClienteComponent } from './cuotas-suscripcion-cliente/cuotas-suscripcion-cliente.component';
import { DetalleCuotasSuscripcionClienteComponent } from './detalle-cuotas-suscripcion-cliente/detalle-cuotas-suscripcion-cliente.component';
import { PagosClienteComponent } from './pagos-cliente/pagos-cliente.component';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaClientesComponent },
  {
    path: ':idcliente',
    component: DetalleClienteComponent,
    data: { idfuncionalidad: 185, name: "Formulario de Cliente" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idcliente/pagos',
    component: PagosClienteComponent,
    data: { idfuncionalidad: 361, name: "Pagos del Cliente" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idcliente/domicilios',
    component: DomiciliosClienteComponent,
    data: { idfuncionalidad: 206, name: "Domicilios" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idcliente/domicilios/:iddomicilio',
    component: DetalleDomicilioClienteComponent,
    data: { idfuncionalidad: 204, name: "Formulario de Domicilios" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idcliente/suscripciones',
    component: SuscripcionesClienteComponent,
    data: { idfuncionalidad: 165, name: "Suscripciones" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idcliente/suscripciones/:idsuscripcion',
    component: DetalleSuscripcionClienteComponent,
    data: { idfuncionalidad: 166, name: "Formulario de Suscripción" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idcliente/suscripciones/:idsuscripcion/cuotas',
    component: CuotasSuscripcionClienteComponent,
    data: { idfuncionalidad: 225, name: "Cuotas" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idcliente/suscripciones/:idsuscripcion/cuotas/:idcuota',
    component: DetalleCuotasSuscripcionClienteComponent,
    data: { idfuncionalidad: 224, name: "Formulario de Cuota"}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
