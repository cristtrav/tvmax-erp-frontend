import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaServiciosComponent } from './pages/vista-servicios/vista-servicios.component';
import { DetalleServicioComponent } from './pages/detalle-servicio/detalle-servicio.component';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaServiciosComponent },
  {
    path: ':id',
    component: DetalleServicioComponent,
    data: { idfuncionalidad: 25, name: 'Formulario de Servicios' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule { }
