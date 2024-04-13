import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaVentasComponent } from './vista-ventas/vista-ventas.component';
import { DetalleVentaComponent } from './detalle-venta/detalle-venta.component';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaVentasComponent },
  {
    path: ':idventa',
    component: DetalleVentaComponent,
    data: { idfuncionalidad: 380, name: "Punto de Venta (POS)" },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
