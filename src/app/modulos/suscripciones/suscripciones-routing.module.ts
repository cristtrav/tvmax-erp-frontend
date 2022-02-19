import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaSuscripcionesComponent } from './vista-suscripciones/vista-suscripciones.component';
import { DetalleSuscripcionComponent } from './detalle-suscripcion/detalle-suscripcion.component';
import { CuotasSuscripcionesComponent } from './cuotas-suscripciones/cuotas-suscripciones.component';
import { DetalleCuotasSuscripcionesComponent } from './detalle-cuotas-suscripciones/detalle-cuotas-suscripciones.component';
import { ReporteSuscripcionesComponent } from '../impresion/reporte-suscripciones/reporte-suscripciones.component';

const routes: Routes = [
  { path: '', component: VistaSuscripcionesComponent},
  { path: 'reporte', component: ReporteSuscripcionesComponent},
  { path: ':idsuscripcion', component: DetalleSuscripcionComponent },
  { path: ':idsuscripcion/cuotas', component: CuotasSuscripcionesComponent },
  { path: ':idsuscripcion/cuotas/:idcuota', component: DetalleCuotasSuscripcionesComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuscripcionesRoutingModule { }
