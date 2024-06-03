import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaDistritosComponent } from './pages/vista-distritos/vista-distritos.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';
import { DetalleDistritoComponent } from './pages/detalle-distrito/detalle-distrito.component';

const routes: Routes = [
  { path: '', component: VistaDistritosComponent },
  {
    path: ':id',
    component: DetalleDistritoComponent,
    data: { idfuncionalidad: 65, name: 'Distritos'},
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistritosRoutingModule { }
