import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaMaterialesComponent } from './pages/vista-materiales/vista-materiales.component';
import { DetalleMaterialComponent } from './pages/detalle-material/detalle-material.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';
import { VistaAjustesExistenciasMaterialesComponent } from './pages/vista-ajustes-existencias-materiales/vista-ajustes-existencias-materiales.component';
import { DetalleAjusteExistenciaMaterialComponent } from './pages/detalle-ajuste-existencia-material/detalle-ajuste-existencia-material.component';

const routes: Routes = [
  { path: '', component: VistaMaterialesComponent },
  {
    path: ':idmaterial',
    component: DetalleMaterialComponent,
    data: { idfuncionalidad: 685, name: 'Formulario de Materiales' },
    canActivate: [canAccessFn]
  },
  {
    path: ':idmaterial/ajustesexistencias',
    component: VistaAjustesExistenciasMaterialesComponent,
    data: { idfuncionalidad: 1400, name: 'Ajustes de existencias de materiales'},
    canActivate: [canAccessFn]
  },
  {
    path: ':idmaterial/ajustesexistencias/:idajusteexistencia',
    component: DetalleAjusteExistenciaMaterialComponent,
    data: { idfuncionalidad: 1401, name: 'Formulario de ajuste de existencia' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
