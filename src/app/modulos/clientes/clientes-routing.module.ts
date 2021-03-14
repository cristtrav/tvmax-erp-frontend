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

const routes: Routes = [
  { path: '', component: VistaClientesComponent },
  { path: ':idcliente', component: DetalleClienteComponent },
  { path: ':idcliente/domicilios', component: DomiciliosClienteComponent },
  { path: ':idcliente/domicilios/:iddomicilio', component: DetalleDomicilioClienteComponent},
  { path: ':idcliente/suscripciones', component: SuscripcionesClienteComponent },
  { path: ':idcliente/suscripciones/:idsuscripcion', component: DetalleSuscripcionClienteComponent },
  { path: ':idcliente/suscripciones/:idsuscripcion/cuotas', component: CuotasSuscripcionClienteComponent},
  { path: ':idcliente/suscripciones/:idsuscripcion/cuotas/:idcuota', component: DetalleCuotasSuscripcionClienteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
