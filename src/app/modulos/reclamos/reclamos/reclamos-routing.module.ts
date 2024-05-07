import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaReclamosComponent } from './vista-reclamos/vista-reclamos.component';
import { DetalleReclamoComponent } from './detalle-reclamo/detalle-reclamo.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaReclamosComponent },
  {
    path: ':idreclamo',
    component: DetalleReclamoComponent,
    data: { idfuncionalidad: 801, name: 'Formulario de Reclamos'},
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReclamosRoutingModule { }
