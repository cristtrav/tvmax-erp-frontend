import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaTimbradosComponent } from './vista-timbrados/vista-timbrados.component';
import { DetalleTimbradoComponent } from './detalle-timbrado/detalle-timbrado.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const formTimbradoGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(245)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Timbrados'
    );
    return false;
  }else return true;
}

const routes: Routes = [
  { path: '', component: VistaTimbradosComponent },
  { path: ':idtimbrado', component: DetalleTimbradoComponent, canActivate: [formTimbradoGuardFn] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimbradosRoutingModule { }
