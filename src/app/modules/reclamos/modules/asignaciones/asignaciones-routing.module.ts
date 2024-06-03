import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaAsignacionesReclamosComponent } from './pages/vista-asignaciones-reclamos/vista-asignaciones-reclamos.component';
import { DetalleAsignacionReclamoComponent } from './pages/detalle-asignacion-reclamo/detalle-asignacion-reclamo.component';
import { FormFinalizarReclamoComponent } from './pages/form-finalizar-reclamo/form-finalizar-reclamo.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';
import { UbicacionReclamoComponent } from './pages/ubicacion-reclamo/ubicacion-reclamo.component';

const routes: Routes = [
  { path: '', component: VistaAsignacionesReclamosComponent },
  {
    path: ':idreclamo',
    component: DetalleAsignacionReclamoComponent,
    data: { idfuncionalidad: 881, name: 'Detalle de Reclamo' },
    canActivate: [canAccessFn]
  },
  {
    path: ':idreclamo/finalizar',
    component: FormFinalizarReclamoComponent,
    data: { idfuncionalidad: 884, name: 'Finalizar reclamo' },
    canActivate: [canAccessFn]
  },
  {
    path: ':idreclamo/ubicacion',
    component: UbicacionReclamoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionesRoutingModule { }
