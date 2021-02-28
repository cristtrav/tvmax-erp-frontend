import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaServiciosComponent } from './vista-servicios/vista-servicios.component';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';

const routes: Routes = [
  {path: '', component: VistaServiciosComponent},
  {path: ':id', component: DetalleServicioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule { }
