import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleFormatoFacturaComponent } from './detalle-formato-factura/detalle-formato-factura.component';
import { VistaFormatosFacturasComponent } from './vista-formatos-facturas/vista-formatos-facturas.component';

const routes: Routes = [
  {path: '', component: VistaFormatosFacturasComponent},
  {path: ':id', component: DetalleFormatoFacturaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormatosFacturasRoutingModule { }
