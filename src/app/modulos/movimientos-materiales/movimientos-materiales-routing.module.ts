import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaMovimientosMaterialesComponent } from './vista-movimientos-materiales/vista-movimientos-materiales.component';
import { DetalleMovimientoMaterialComponent } from './detalle-movimiento-material/detalle-movimiento-material.component';

const routes: Routes = [
  {path: '', component: VistaMovimientosMaterialesComponent },
  {path: ':idmovimientomaterial', component: DetalleMovimientoMaterialComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosMaterialesRoutingModule { }
