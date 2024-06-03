import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaFormatosFacturasComponent } from './pages/vista-formatos-facturas/vista-formatos-facturas.component';
import { DetalleFormatoFacturaComponent } from './pages/detalle-formato-factura/detalle-formato-factura.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaFormatosFacturasComponent },
  {
    path: ':id',
    component: DetalleFormatoFacturaComponent,
    data: { idfuncionalidad: 345, name: 'Detalle de Formato de Factura' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormatosFacturasRoutingModule { }
