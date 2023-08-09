import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { DetalleFormatoFacturaComponent } from './detalle-formato-factura/detalle-formato-factura.component';
import { VistaFormatosFacturasComponent } from './vista-formatos-facturas/vista-formatos-facturas.component';
import { SesionService } from '@servicios/sesion.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

const formFormatosGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if(!inject(SesionService).permisos.has(345)){
    inject(NzNotificationService).create(
      'warning',
      '<strong>No autorizado</strong>',
      'El usuario no tiene permisos para acceder al formulario de Formatos de Facturas'
    );
    return false;
  }else return true;
}

const routes: Routes = [
  {path: '', component: VistaFormatosFacturasComponent},
  {path: ':id', component: DetalleFormatoFacturaComponent, canActivate: [formFormatosGuardFn]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormatosFacturasRoutingModule { }
