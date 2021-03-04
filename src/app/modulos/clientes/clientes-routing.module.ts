import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaClientesComponent } from './../../modulos/clientes/vista-clientes/vista-clientes.component';
import { DetalleClienteComponent } from './../../modulos/clientes/detalle-cliente/detalle-cliente.component';

const routes: Routes = [
  { path: '', component: VistaClientesComponent },
  { path: ':id', component: DetalleClienteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
