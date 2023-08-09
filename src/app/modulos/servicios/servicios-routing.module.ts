import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { VistaServiciosComponent } from './vista-servicios/vista-servicios.component';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const guardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(25)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Servicios'
    );
    return false;
  }else return true;
}

const routes: Routes = [
  {path: '', component: VistaServiciosComponent},
  {path: ':id', component: DetalleServicioComponent, canActivate: [guardFn]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiciosRoutingModule { }
