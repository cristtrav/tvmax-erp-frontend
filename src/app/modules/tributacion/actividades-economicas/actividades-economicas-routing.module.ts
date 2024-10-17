import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaActividadesEconimicasComponent } from './pages/vista-actividades-econimicas/vista-actividades-econimicas.component';
import { DetalleActividadEconimicaComponent } from './pages/detalle-actividad-econimica/detalle-actividad-econimica.component';

const routes: Routes = [
  { path: '', component: VistaActividadesEconimicasComponent },
  { path: ':idactividad', component: DetalleActividadEconimicaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesEconomicasRoutingModule { }
