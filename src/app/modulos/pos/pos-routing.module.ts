import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleVentaComponent } from '../ventas/detalle-venta/detalle-venta.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'nueva',
    pathMatch: 'full'
  },
  {
    path: ':idventa', component: DetalleVentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
