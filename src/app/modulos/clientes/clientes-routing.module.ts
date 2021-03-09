import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaClientesComponent } from './../../modulos/clientes/vista-clientes/vista-clientes.component';
import { DetalleClienteComponent } from './../../modulos/clientes/detalle-cliente/detalle-cliente.component';
import { DomiciliosClienteComponent } from './domicilios-cliente/domicilios-cliente.component';
import { DetalleDomicilioClienteComponent } from './detalle-domicilio-cliente/detalle-domicilio-cliente.component';

const routes: Routes = [
  { path: '', component: VistaClientesComponent },
  { path: ':idcliente', component: DetalleClienteComponent },
  { path: ':idcliente/domicilios', component: DomiciliosClienteComponent },
  { path: ':idcliente/domicilios/:iddomicilio', component: DetalleDomicilioClienteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
