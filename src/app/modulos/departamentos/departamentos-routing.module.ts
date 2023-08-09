import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaDepartamentosComponent } from './vista-departamentos/vista-departamentos.component';
import { DetalleDepartamentoComponent } from './detalle-departamento/detalle-departamento.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const guardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(45)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Departamentos'
    );
    return false;
  }else return true;
}

const routes: Routes = [
  { path: '', component: VistaDepartamentosComponent },
  { path: ':id', component: DetalleDepartamentoComponent, canActivate: [guardFn]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentosRoutingModule { }
