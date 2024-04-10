import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaSuscripcionesComponent } from './vista-suscripciones/vista-suscripciones.component';
import { DetalleSuscripcionComponent } from './detalle-suscripcion/detalle-suscripcion.component';
import { CuotasSuscripcionesComponent } from './cuotas-suscripciones/cuotas-suscripciones.component';
import { DetalleCuotasSuscripcionesComponent } from './detalle-cuotas-suscripciones/detalle-cuotas-suscripciones.component';
import { ReporteSuscripcionesComponent } from '../impresion/reporte-suscripciones/reporte-suscripciones.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaSuscripcionesComponent},
  { path: 'reporte', component: ReporteSuscripcionesComponent },
  {
    path: ':idsuscripcion',
    component: DetalleSuscripcionComponent,
    data: {idfuncionalidad: 166, name: "Formulario de Suscripción"},
    canActivate: [canAccessFn]
  },
  {
    path: ':idsuscripcion/cuotas',
    component: CuotasSuscripcionesComponent,
    data: { idfuncionalidad: 225, name: "Cuotas" },
    canActivate: [canAccessFn]
  },
  {
    path: ':idsuscripcion/cuotas/:idcuota',
    component: DetalleCuotasSuscripcionesComponent,
    data: { idfuncionalidad: 224, name: "Formulario de Cuota" },
    canActivate: [canAccessFn]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuscripcionesRoutingModule { }
