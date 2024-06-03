import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaMovimientosMaterialesComponent } from './pages/vista-movimientos-materiales/vista-movimientos-materiales.component';
import { DetalleMovimientoMaterialComponent } from './pages/detalle-movimiento-material/detalle-movimiento-material.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaMovimientosMaterialesComponent },
  {
    path: ':idmovimientomaterial',
    component: DetalleMovimientoMaterialComponent,
    data: { idfuncionalidad: 645, name: 'Detalle de Movimiento de Material' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosMaterialesRoutingModule { }
