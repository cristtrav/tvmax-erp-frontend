import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaEstablecimientosComponent } from './pages/vista-establecimientos/vista-establecimientos.component';
import { DetalleEstablecimientoComponent } from './pages/detalle-establecimiento/detalle-establecimiento.component';

const routes: Routes = [
  { path: '', component: VistaEstablecimientosComponent },
  { path: ':idestablecimiento', component: DetalleEstablecimientoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstablecimientosRoutingModule { }
