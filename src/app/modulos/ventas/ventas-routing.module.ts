import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaVentasComponent } from './vista-ventas/vista-ventas.component';
import { DetalleVentaComponent } from './detalle-venta/detalle-venta.component';

const routes: Routes = [
  { path: '', component: VistaVentasComponent },
  { path: ':idventa', component: DetalleVentaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
